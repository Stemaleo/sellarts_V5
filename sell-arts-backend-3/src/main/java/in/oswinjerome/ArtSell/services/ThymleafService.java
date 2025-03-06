package in.oswinjerome.ArtSell.services;

import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.Map;

@Service
public class ThymleafService {

    private final SpringTemplateEngine templateEngine;

    public ThymleafService(SpringTemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }


    public String generateHtmlString(String templateName, Map<String, Object> data){

        Context context = new Context();
        context.setVariables(data);
        return templateEngine.process(templateName, context);
    }

}
