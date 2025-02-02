package in.oswinjerome.ArtSell.services;

import com.lowagie.text.pdf.PdfAction;
import com.lowagie.text.pdf.PdfReader;
import com.lowagie.text.pdf.PdfStamper;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.*;
import java.util.Map;

@Service
public class PdfGeneratorService {


    @Autowired
    ThymleafService thymleafService;


    public byte[] generatePdf(String templateName, Map<String, Object> data) {
        String htmlContent = thymleafService.generateHtmlString(templateName,data);
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(htmlContent);
            renderer.layout();
            renderer.createPDF(outputStream);
            return outputStream.toByteArray();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException("Error generating PDF", e);
        }
    }


}
