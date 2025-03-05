package in.oswinjerome.ArtSell.services;

import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.notification.Notification;
import in.oswinjerome.ArtSell.notification.NotificationRepo;
import in.oswinjerome.ArtSell.user.UsersRepo;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private UsersRepo usersRepo;
    @Autowired
    private NotificationRepo notificationRepo;

    @Async
    public void sendHtmlEmail(String to,String cc, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            if(cc!=null) {
                helper.setCc(cc);
            }
            helper.setFrom("sellarts@sellarts.net");
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Error sending email: " + e.getMessage(), e);
        }
    }

    public void sendEmailWithAttachment(String to, String subject, String text, String fileName, byte[] fileContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // Set email details
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text, true);
            helper.setFrom("sellarts@sellarts.net");


            // Add attachment
            helper.addAttachment(fileName, new org.springframework.core.io.ByteArrayResource(fileContent));

            // Send email
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Error while sending email with attachment: " + e.getMessage(), e);
        }
    }


    public Notification createNotification(Long userId, String message, String description) {
        User user = usersRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setDescription(description);

        return notificationRepo.save(notification);
    }

}
