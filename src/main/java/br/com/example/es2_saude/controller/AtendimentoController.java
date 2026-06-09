package br.com.example.es2_saude.controller;

import br.com.example.es2_saude.model.Atendimento;
import br.com.example.es2_saude.service.AtendimentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/atendimentos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AtendimentoController {

    private final AtendimentoService service;

    @PostMapping
    public ResponseEntity<Atendimento> inserir(@RequestBody Atendimento a) {
        return ResponseEntity.ok(service.inserir(a));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Atendimento> alterar(@PathVariable Long id, @RequestBody Atendimento a) {
        return ResponseEntity.ok(service.alterar(id, a));
    }

    @GetMapping
    public ResponseEntity<List<Atendimento>> consultarTodos() {
        return ResponseEntity.ok(service.consultarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Atendimento> consultarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.consultarPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}