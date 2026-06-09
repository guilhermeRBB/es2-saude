package br.com.example.es2_saude.repository;

import br.com.example.es2_saude.model.ProfissionalSaude;
import br.com.example.es2_saude.model.enums.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProfissionalRepository extends JpaRepository<ProfissionalSaude, Long> {
    List<ProfissionalSaude> findByNomeContainingIgnoreCase(String nome);
    List<ProfissionalSaude> findByCategoria(Categoria categoria);
}