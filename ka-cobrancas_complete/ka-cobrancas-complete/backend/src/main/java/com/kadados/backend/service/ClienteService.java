package com.kadados.backend.service;

import com.kadados.backend.model.Cliente;
import com.kadados.backend.repository.ClienteRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {
    private final ClienteRepository repo;
    public ClienteService(ClienteRepository repo){this.repo=repo;}
    public List<Cliente> listar(){return repo.findAll();}
    public Cliente salvar(Cliente c){return repo.save(c);}
    public Optional<Cliente> porEmail(String email){return repo.findByEmail(email);}
}
