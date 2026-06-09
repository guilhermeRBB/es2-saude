package br.com.example.es2_saude.controller;

import br.com.example.es2_saude.model.ExameLab;
import br.com.example.es2_saude.service.ExameLabService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/exames")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ExameLabController {

    private final ExameLabService service;

    @PostMapping
    public ResponseEntity<ExameLab> inserir(@RequestBody ExameLab e) {
        return ResponseEntity.ok(service.inserir(e));
    }

    @GetMapping
    public ResponseEntity<List<ExameLab>> consultarTodos() {
        return ResponseEntity.ok(service.consultarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExameLab> consultarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.consultarPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}