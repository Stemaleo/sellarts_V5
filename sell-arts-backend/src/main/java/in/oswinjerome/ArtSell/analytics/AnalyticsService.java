package in.oswinjerome.ArtSell.analytics;

import in.oswinjerome.ArtSell.artworks.ArtWorkRepo;
import in.oswinjerome.ArtSell.auth.AuthService;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.orders.OrderRepo;
import in.oswinjerome.ArtSell.user.UsersRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;

@Service
public class AnalyticsService {
    private final UsersRepo usersRepo;
    private final OrderRepo orderRepo;
    private final ArtWorkRepo artWorkRepo;
    private final AuthService authService;

    LocalDateTime now = LocalDateTime.now();
    LocalDateTime monthStart = now.with(TemporalAdjusters.firstDayOfMonth());
    LocalDateTime lastMonthStart = now.minusMonths(1).with(TemporalAdjusters.firstDayOfMonth());
    LocalDateTime lastMonthEnd = now.minusMonths(1).with(TemporalAdjusters.lastDayOfMonth());

    public AnalyticsService(UsersRepo usersRepo, OrderRepo orderRepo, ArtWorkRepo artWorkRepo, AuthService authService) {
        this.usersRepo = usersRepo;
        this.orderRepo = orderRepo;
        this.artWorkRepo = artWorkRepo;
        this.authService = authService;
    }

    public ResponseEntity<ResponseDTO> adminDashboard() {
        AdminAnalyticsDTO dto = new AdminAnalyticsDTO();

        dto.setUserTotal(usersRepo.count());
        dto.setUserThisMonth(usersRepo.countAllByRegisteredAtBetween(monthStart, now));
        dto.setArtistTotal(usersRepo.countAllArtists());
        dto.setArtistLastMonth(usersRepo.countAllByRegisteredAtBetween(monthStart, now));

        analyseAccounts(dto);
        analyseOrders(dto);
        analyseArtworks(dto);

        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data(dto)
                .build());
    }

    private void analyseArtworks(AdminAnalyticsDTO dto) {
        dto.setTotalArtworks(artWorkRepo.count());
        dto.setTotalArtworksThisMonth(artWorkRepo.countByCreatedAtBetween(monthStart, now));
        dto.setTopSellingArtworks(artWorkRepo.findTopSelling());
    }

    private void analyseArtworks(AdminAnalyticsDTO dto, User user) {
        dto.setTotalArtworks(artWorkRepo.countByOwner(user));
        dto.setTotalArtworksThisMonth(artWorkRepo.countByOwnerAndCreatedAtBetween(user, monthStart, now));
        dto.setTopSellingArtworks(artWorkRepo.findTopSelling(user));
    }

    private void analyseOrders(AdminAnalyticsDTO dto) {
        dto.setTotalOrders(orderRepo.count());
        dto.setTotalOrdersThisMonth(orderRepo.countAllBetween(monthStart, now));
        dto.setAverageOrderValue(orderRepo.averageValue());
        dto.setAverageOrderValueThisMonth(orderRepo.averageValueBetween(monthStart, now));
    }

    private void analyseAccounts(AdminAnalyticsDTO dto) {
        dto.setTotalRevenue(safeBigDecimal(orderRepo.sumOfAdminShare()));
        BigDecimal lastMonthRevenue = safeBigDecimal(orderRepo.sumOfAdminShareBetween(lastMonthStart, lastMonthEnd));
        BigDecimal thisMonth = safeBigDecimal(orderRepo.sumOfAdminShareBetween(monthStart, now));

        double growthPercentage = calculateGrowthPercentage(lastMonthRevenue, thisMonth);
        dto.setThisMonthRevenueGrowth(growthPercentage);
    }

    private void analyseOrders(AdminAnalyticsDTO dto, User user) {
        dto.setTotalOrders(orderRepo.countArtistOrder(user));
        dto.setTotalOrdersThisMonth(orderRepo.countAllBetween(user, monthStart, now));
        dto.setAverageOrderValue(orderRepo.averageValue(user));
        dto.setAverageOrderValueThisMonth(orderRepo.averageValueBetween(user, monthStart, now));
    }

    private void analyseAccounts(AdminAnalyticsDTO dto, User user) {
        dto.setTotalRevenue(safeBigDecimal(orderRepo.sumOfArtistShare(user)));
        BigDecimal lastMonthRevenue = safeBigDecimal(orderRepo.sumOfArtistShareBetween(user, lastMonthStart, lastMonthEnd));
        BigDecimal thisMonth = safeBigDecimal(orderRepo.sumOfArtistShareBetween(user, monthStart, now));

        double growthPercentage = calculateGrowthPercentage(lastMonthRevenue, thisMonth);
        dto.setThisMonthRevenueGrowth(growthPercentage);
    }

    public ResponseEntity<ResponseDTO> artistDashboard() {
        User user = authService.getCurrentUser();
        AdminAnalyticsDTO dto = new AdminAnalyticsDTO();

        analyseAccounts(dto, user);
        analyseOrders(dto, user);
        analyseArtworks(dto, user);

        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data(dto)
                .build());
    }

    private BigDecimal safeBigDecimal(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    private double calculateGrowthPercentage(BigDecimal lastMonthRevenue, BigDecimal thisMonth) {
        if (lastMonthRevenue.compareTo(BigDecimal.ZERO) != 0) {
            return thisMonth.subtract(lastMonthRevenue)
                    .divide(lastMonthRevenue, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        } else {
            return thisMonth.compareTo(BigDecimal.ZERO) > 0 ? 100.0 : 0.0;
        }
    }
}
