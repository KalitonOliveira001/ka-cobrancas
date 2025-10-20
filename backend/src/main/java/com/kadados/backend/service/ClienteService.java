package com.kadados.backend.service;

import com.kadados.backend.model.Cliente;
import com.kadados.backend.repository.ClienteRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    private final ClienteRepository repository;

   
    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    public List<Cliente> listar() {
        return repository.findAll();
    }

    
    public Optional<Cliente> porId(Long id) {
        return repository.findById(id);
    }

    public Optional<Cliente> porEmail(String email) {
        return repository.findByEmail(email);
    }

    public Cliente salvar(Cliente c) {
        return repository.save(c);
    }

    public void remover(Long id) {
        repository.deleteById(id);
    }
}