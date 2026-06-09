package br.com.example.es2_saude.controller;

import br.com.example.es2_saude.model.ProfissionalSaude;
import br.com.example.es2_saude.model.enums.Categoria;
import br.com.example.es2_saude.service.ProfissionalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/profissionais")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfissionalController {

    private final ProfissionalService service;

    @PostMapping
    public ResponseEntity<ProfissionalSaude> inserir(@RequestBody ProfissionalSaude p) {
        return ResponseEntity.ok(service.inserir(p));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfissionalSaude> alterar(@PathVariable Long id, @RequestBody ProfissionalSaude p) {
        return ResponseEntity.ok(service.alterar(id, p));
    }

    @GetMapping
    public ResponseEntity<List<ProfissionalSaude>> consultarTodos() {
        return ResponseEntity.ok(service.consultarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfissionalSaude> consultarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.consultarPorId(id));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ProfissionalSaude>> consultarPorNome(@RequestParam String nome) {
        return ResponseEntity.ok(service.consultarPorNome(nome));
    }

    @GetMapping("/categoria")
    public ResponseEntity<List<ProfissionalSaude>> consultarPorCategoria(@RequestParam Categoria categoria) {
        return ResponseEntity.ok(service.consultarPorCategoria(categoria));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}