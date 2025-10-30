package com.ka.kacobrancas;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Esta classe configura a permissão para que o Frontend, hospedado em outro domínio,
// consiga fazer requisições para o nosso Backend.

@Configuration
public class CorsConfiguration implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Aplica a configuração a todos os endpoints do Backend (/**)
        registry.addMapping("/**")
            // CORREÇÃO FINAL: Permite requisições de *qualquer* origem (*), resolvendo problemas no Railway.
            .allowedOrigins("*") 
            // Permite todos os métodos HTTP (GET, POST, PUT, DELETE, etc.)
            .allowedMethods("*")
            // Permite que o cliente inclua cabeçalhos personalizados
            .allowedHeaders("*");
            // Nota: Não podemos usar .allowCredentials(true) junto com .allowedOrigins("*"), então removemos.
    }
}
