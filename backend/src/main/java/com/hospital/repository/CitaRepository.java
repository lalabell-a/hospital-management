package com.hospital.repository;

import com.hospital.model.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Long> {

    List<Cita> findByPacienteId(Long pacienteId);

    List<Cita> findByDoctorId(Long doctorId);

    List<Cita> findByEstado(String estado);

    // BUG INTENCIONAL: N+1 query — no usa JOIN FETCH para cargar el doctor
    // Cuando se llame desde el servicio, cada cita hara una consulta separada para doctor
    List<Cita> findByFechaHoraBetween(LocalDateTime inicio, LocalDateTime fin);

    // BUG: esta query JPQL hace join implicito pero sin FETCH, generando N+1
    @Query("SELECT c FROM Cita c WHERE c.estado = :estado ORDER BY c.fechaHora")
    List<Cita> findCitasByEstadoOrdered(@Param("estado") String estado);
}
