package com.kadados.backend.controller;

import com.kadados.backend.model.Cliente;
import com.kadados.backend.service.ClienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*")
public class ClienteController {
    private final ClienteService service;
    public ClienteController(ClienteService s){this.service=s;}
    @GetMapping
    public List<Cliente> listar(){return service.listar();}
    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastro(@RequestBody Cliente c){
        if(service.porEmail(c.getEmail()).isPresent()){
            return ResponseEntity.status(400).body(Map.of("error","email já cadastrado"));
        }
        return ResponseEntity.ok(service.salvar(c));
    }
    @GetMapping("/validate")
    public ResponseEntity<?> validate(@RequestParam String email){
        return service.porEmail(email).map(cl -> ResponseEntity.ok(Map.of("valid", true, "email", cl.getEmail())))
                .orElse(ResponseEntity.ok(Map.of("valid", false)));
    }
}
