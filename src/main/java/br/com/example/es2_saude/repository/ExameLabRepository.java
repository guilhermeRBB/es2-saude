package br.com.example.es2_saude.repository;

import br.com.example.es2_saude.model.ExameLab;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExameLabRepository extends JpaRepository<ExameLab, Long> {
}