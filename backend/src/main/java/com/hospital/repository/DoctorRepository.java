package com.hospital.repository;

import com.hospital.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    List<Doctor> findByEspecialidadContainingIgnoreCase(String especialidad);

    List<Doctor> findByApellidoContainingIgnoreCase(String apellido);

    // BUG INTENCIONAL: sin @Query definido, Spring Data genera el query
    // pero el nombre del metodo sugiere busqueda por nombre completo que no funciona bien
    List<Doctor> findByNombreAndApellido(String nombre, String apellido);
}
