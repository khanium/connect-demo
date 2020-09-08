package com.couchbase.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("index");
        registry.addViewController("/testha").setViewName("testha");
        registry.addViewController("/taskboard").setViewName("taskboard");
        registry.addViewController("/dashboard").setViewName("dashboard");
        registry.addViewController("/geospatial").setViewName("geospatial");
        registry.addViewController("/about").setViewName("about");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/static/images/");

        registry.addResourceHandler("/css/**")
                .addResourceLocations("classpath:/static/css/");

        registry.addResourceHandler("/js/**")
                .addResourceLocations("classpath:/static/js/");

        registry.addResourceHandler("/webfonts/**")
                .addResourceLocations("classpath:/static/webfonts/");
    }

}
