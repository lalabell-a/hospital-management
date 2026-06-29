package com.hospital.repository;

import com.hospital.model.HistoriaClinica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoriaClinicaRepository extends JpaRepository<HistoriaClinica, Long> {

    List<HistoriaClinica> findByPacienteId(Long pacienteId);

    List<HistoriaClinica> findByDoctorId(Long doctorId);

    // BUG INTENCIONAL: metodo sin paginacion — si hay muchos registros puede causar OOM
    List<HistoriaClinica> findAllByOrderByFechaCreacionDesc();
}
