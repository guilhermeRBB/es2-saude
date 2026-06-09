package br.com.example.es2_saude.repository;

import br.com.example.es2_saude.model.Atendimento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AtendimentoRepository extends JpaRepository<Atendimento, Long> {
}