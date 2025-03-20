package in.oswinjerome.ArtSell.services;

import in.oswinjerome.ArtSell.models.ArtWork;
import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.notification.DBNotificationService;
import in.oswinjerome.ArtSell.orders.Order;
import in.oswinjerome.ArtSell.tickets.Ticket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class NotificationService {

    @Autowired
    MailService mailService;

    @Autowired
    ThymleafService thymleafService;

    @Autowired
    PdfGeneratorService pdfGeneratorService;


    public void sendWelcomeNotification(User user) {
        Map<String,Object> map = new HashMap<>();
        map.put("user", user);
        String content = thymleafService.generateHtmlString("welcome_email",map);
        mailService.sendHtmlEmail(user.getEmail(),null,"Welcome to SellArts",content);

    }
    public void sendRaiseTicket(User user, Ticket ticket) {
        Map<String,Object> map = new HashMap<>();
        map.put("user", user);
        map.put("ticket", ticket);
        String content = thymleafService.generateHtmlString("ticket_raised",map);
        // mailService.sendHtmlEmail(user.getEmail(), "admin@sellarts.net","Ticket Raised",content);
        // mailService.createNotification(user.getId(),"Ticket Raised","Your ticket has been raised: #"+ticket.getId());

    }
    public void sendOrderPlacedNotification(Order order) {
        Map<String,Object> map = new HashMap<>();
        map.put("user", order.getOwner());
        map.put("order", order);
        String content = thymleafService.generateHtmlString("order_placed_email",map);

       byte[] raw = pdfGeneratorService.generatePdf("invoice_pdf",map);

//        mailService.sendHtmlEmail(order.getOwner().getEmail(),"Order Placed",content);
        // mailService.sendEmailWithAttachment(order.getOwner().getEmail(),"Order Placed",content,"Invoice.pdf",raw);
    }


    public void sendBidApprovedNotification(User user, ArtWork artWork) {
        Map<String,Object> map = new HashMap<>();
        map.put("user", user);
        map.put("art", artWork);
        String content = thymleafService.generateHtmlString("bid_approved",map);
        mailService.sendHtmlEmail(user.getEmail(),null,"Bid Approved",content);
        mailService.createNotification(user.getId(),"Bid Approved","Your bid has been approved for"+artWork.getTitle());
    }


    public void sendPasswordResetNotification(User user, String randomStr) {
        Map<String,Object> map = new HashMap<>();
        map.put("user", user);
        map.put("newPassword", randomStr);
        String content = thymleafService.generateHtmlString("password_reset",map);
        mailService.sendHtmlEmail(user.getEmail(),null,"Password Reset",content);
    }
}
