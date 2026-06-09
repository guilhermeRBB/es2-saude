package br.com.example.es2_saude.service;

import br.com.example.es2_saude.model.ExameLab;
import br.com.example.es2_saude.repository.ExameLabRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExameLabService {

    private final ExameLabRepository repository;

    public ExameLab inserir(ExameLab e) {
        return repository.save(e);
    }

    public List<ExameLab> consultarTodos() {
        return repository.findAll();
    }

    public ExameLab consultarPorId(Long id) {
        return repository.findById(id).orElseThrow();
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }
}