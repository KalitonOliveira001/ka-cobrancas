package com.kadados.backend.controller;

import com.kadados.backend.model.Cliente;
import com.kadados.backend.service.ClienteService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/clientes")
@CrossOrigin(origins = "https://zestful-reprieve-production.up.railway.app")
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    // Rota GET (Listar Todos)
    @GetMapping
    public List<Cliente> listarTodos() {
        return service.listar(); 
    }

    // Rota POST (Cadastrar)
    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastro(@RequestBody Cliente c) {
        if (service.porEmail(c.getEmail()).isPresent()) {
            return ResponseEntity.status(400).body(Map.of("error", "email já cadastrado"));
        }
        return ResponseEntity.ok(service.salvar(c));
    }

    
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> editar(@PathVariable Long id, @RequestBody Cliente clienteDetalhes) {
        Optional<Cliente> clienteExistente = service.porId(id);

        if (clienteExistente.isPresent()) {
            Cliente cliente = clienteExistente.get();
            cliente.setNome(clienteDetalhes.getNome());
            cliente.setEmail(clienteDetalhes.getEmail());
            cliente.setSenha(clienteDetalhes.getSenha());
            
            Cliente clienteAtualizado = service.salvar(cliente);
            return ResponseEntity.ok(clienteAtualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> remover(@PathVariable Long id) {
        if (service.porId(id).isPresent()) {
            service.remover(id);
            return ResponseEntity.noContent().build(); 
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    
    @GetMapping("/validate")
    public ResponseEntity<?> validate(@RequestParam String email) {
        return service.porEmail(email)
            .map(cl -> ResponseEntity.ok(Map.of("valid", true)))
            .orElse(ResponseEntity.ok(Map.of("valid", false)));
    }
}