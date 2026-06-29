package com.hospital.service;

import com.hospital.dto.CitaDTO;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.model.Cita;
import com.hospital.model.Doctor;
import com.hospital.repository.CitaRepository;
import com.hospital.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
// BUG INTENCIONAL: Falta @Transactional en metodos que modifican datos
public class CitaService {

    private final CitaRepository citaRepository;
    private final DoctorRepository doctorRepository;

    public CitaService(CitaRepository citaRepository, DoctorRepository doctorRepository) {
        this.citaRepository = citaRepository;
        this.doctorRepository = doctorRepository;
    }

    public List<Cita> listarTodas() {
        return citaRepository.findAll();
    }

    public Cita buscarPorId(Long id) {
        return citaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con ID: " + id));
    }

    // BUG INTENCIONAL: no es @Transactional, si falla despues de guardar no hay rollback
    public Cita crear(CitaDTO dto) {
        // BUG: No valida que el paciente exista (no hay FK en DB tampoco)
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor no encontrado"));

        Cita cita = new Cita();
        cita.setPacienteId(dto.getPacienteId());
        cita.setDoctor(doctor);
        cita.setFechaHora(dto.getFechaHora());
        cita.setMotivo(dto.getMotivo());
        cita.setEstado(dto.getEstado() != null ? dto.getEstado() : "PROGRAMADA");

        // BUG: no valida que el doctor no tenga otra cita a la misma hora (doble booking)
        return citaRepository.save(cita);
    }

    public Cita actualizar(Long id, CitaDTO dto) {
        Cita cita = buscarPorId(id);
        cita.setFechaHora(dto.getFechaHora());
        cita.setMotivo(dto.getMotivo());
        if (dto.getEstado() != null) {
            cita.setEstado(dto.getEstado());
        }
        return citaRepository.save(cita);
    }

    public void eliminar(Long id) {
        citaRepository.deleteById(id);
    }

    public List<Cita> listarPorPaciente(Long pacienteId) {
        return citaRepository.findByPacienteId(pacienteId);
    }

    public List<Cita> listarPorDoctor(Long doctorId) {
        // BUG INTENCIONAL: N+1 query - accede al doctor para cada cita
        // cuando se serializa a JSON, cada cita carga el doctor por separado
        return citaRepository.findByDoctorId(doctorId);
    }

    public List<Cita> listarPorEstado(String estado) {
        // BUG: N+1 query - el metodo findCitasByEstadoOrdered no usa JOIN FETCH
        return citaRepository.findCitasByEstadoOrdered(estado);
    }

    public List<Cita> listarPorRangoFechas(LocalDateTime inicio, LocalDateTime fin) {
        // BUG: sin validacion de que inicio < fin
        return citaRepository.findByFechaHoraBetween(inicio, fin);
    }

    // BUG INTENCIONAL: No hay metodo para verificar conflictos de horario (doble booking)
    // Los estudiantes deben identificar esta carencia
}
