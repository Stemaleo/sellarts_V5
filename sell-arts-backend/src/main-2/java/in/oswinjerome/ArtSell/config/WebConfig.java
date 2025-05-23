package in.oswinjerome.ArtSell.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.data.web.config.PageableHandlerMethodArgumentResolverCustomizer;

@Configuration
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
public class WebConfig implements PageableHandlerMethodArgumentResolverCustomizer {
    @Override
    public void customize(PageableHandlerMethodArgumentResolver pageableResolver) {

    }
}
