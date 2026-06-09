package br.com.example.es2_saude.service;

import br.com.example.es2_saude.model.ProfissionalSaude;
import br.com.example.es2_saude.model.enums.Categoria;
import br.com.example.es2_saude.repository.ProfissionalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfissionalService {

    private final ProfissionalRepository repository;

    public ProfissionalSaude inserir(ProfissionalSaude p) {
        return repository.save(p);
    }

    public ProfissionalSaude alterar(Long id, ProfissionalSaude p) {
        p.setId(id);
        return repository.save(p);
    }

    public List<ProfissionalSaude> consultarTodos() {
        return repository.findAll();
    }

    public ProfissionalSaude consultarPorId(Long id) {
        return repository.findById(id).orElseThrow();
    }

    public List<ProfissionalSaude> consultarPorNome(String nome) {
        return repository.findByNomeContainingIgnoreCase(nome);
    }

    public List<ProfissionalSaude> consultarPorCategoria(Categoria categoria) {
        return repository.findByCategoria(categoria);
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }
}