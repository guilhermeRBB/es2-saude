package br.com.example.es2_saude.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "atendimento")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Atendimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate data;
    private LocalTime horario;
    private String problemaTexto;
    private String receitaSaude;

    @ManyToOne
    @JoinColumn(name = "profissional_id")
    @JsonIgnoreProperties("atendimentos")
    private ProfissionalSaude profissional;

    @OneToMany(mappedBy = "atendimento", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ExameLab> exames;
}
