package br.com.example.es2_saude.service;

import br.com.example.es2_saude.model.Atendimento;
import br.com.example.es2_saude.repository.AtendimentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AtendimentoService {

    private final AtendimentoRepository repository;

    public Atendimento inserir(Atendimento a) {
        return repository.save(a);
    }

    public Atendimento alterar(Long id, Atendimento a) {
        a.setId(id);
        return repository.save(a);
    }

    public List<Atendimento> consultarTodos() {
        return repository.findAll();
    }

    public Atendimento consultarPorId(Long id) {
        return repository.findById(id).orElseThrow();
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }
}