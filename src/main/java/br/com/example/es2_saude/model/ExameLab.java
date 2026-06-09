package br.com.example.es2_saude.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "exame_lab")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExameLab {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descricao;

    @ManyToOne
    @JoinColumn(name = "atendimento_id")
    private Atendimento atendimento;
}