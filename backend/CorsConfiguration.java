package com.ka.kacobrancas;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Esta classe configura a permissão para que o Frontend, hospedado em outro domínio,
// consiga fazer requisições para o nosso Backend.

@Configuration
public class CorsConfiguration implements WebMvcConfigurer {

    // URL do seu Frontend hospedado no Railway. É a URL que aparece no seu navegador.
    // DOMÍNIO: zestful-reprieve-production.up.railway.app
    private static final String FRONTEND_ORIGIN = "https://zestful-reprieve-production.up.railway.app";

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Aplica a configuração a todos os endpoints do Backend (/**)
        registry.addMapping("/**")
            // Permite requisições vindas do domínio do Frontend
            .allowedOrigins(FRONTEND_ORIGIN)
            // Permite todos os métodos HTTP (GET, POST, PUT, DELETE, etc.)
            .allowedMethods("*")
            // Permite que o cliente inclua cabeçalhos personalizados
            .allowedHeaders("*")
            // Permite o envio de credenciais (como cookies ou cabeçalhos de autorização)
            .allowCredentials(true)
            // Define por quanto tempo (em segundos) o navegador pode armazenar em cache as informações do CORS
            .maxAge(3600);
    }
}