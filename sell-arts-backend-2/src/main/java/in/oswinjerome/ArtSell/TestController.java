package in.oswinjerome.ArtSell;

import in.oswinjerome.ArtSell.orders.OrderRepo;
import in.oswinjerome.ArtSell.services.PdfGeneratorService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Controller
public class TestController {

    @Autowired
    PdfGeneratorService pdfGeneratorService;
    @Autowired
    private OrderRepo orderRepo;

    @GetMapping("/download-pdf")
    public String downloadPdf(Model model) throws IOException {

        model.addAttribute(orderRepo.findAll().getFirst());

        return "invoice_pdf";
    }



}
