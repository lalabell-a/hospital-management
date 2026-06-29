package com.hospital.controller;

import com.hospital.dto.PacienteDTO;
import com.hospital.model.Paciente;
import com.hospital.service.PacienteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "*")  // BUG INTENCIONAL: CORS demasiado permisivo (OWASP)
public class PacienteController {

    private final PacienteService pacienteService;

    public PacienteController(PacienteService pacienteService) {
        this.pacienteService = pacienteService;
    }

    @GetMapping
    public ResponseEntity<List<Paciente>> listar() {
        return ResponseEntity.ok(pacienteService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paciente> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(pacienteService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Paciente> crear(@Valid @RequestBody PacienteDTO dto) {
        Paciente creado = pacienteService.crear(dto);
        // BUG INTENCIONAL: retorna 200 OK en vez de 201 Created
        return ResponseEntity.ok(creado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Paciente> actualizar(@PathVariable Long id, @Valid @RequestBody PacienteDTO dto) {
        return ResponseEntity.ok(pacienteService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        pacienteService.eliminar(id);
        // BUG INTENCIONAL: no retorna 204 No Content, retorna 200 OK
        return ResponseEntity.ok().build();
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Paciente>> buscarPorNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(pacienteService.buscarPorNombre(nombre));
    }

    @GetMapping("/estadisticas/edad-promedio")
    public ResponseEntity<Double> edadPromedio() {
        return ResponseEntity.ok(pacienteService.calcularEdadPromedio());
    }
}
