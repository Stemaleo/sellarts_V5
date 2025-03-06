package in.oswinjerome.ArtSell.analytics;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class AdminAnalyticsDTO {


    private Long userTotal;
    private Long userThisMonth;

    private Long artistTotal;
    private Long artistLastMonth;

    private Long totalOrders;
    private Long totalOrdersThisMonth;
    private Long averageOrderValue;
    private Long averageOrderValueThisMonth;

    private BigDecimal totalRevenue;
    private double thisMonthRevenueGrowth;

    private Long totalArtworks;
    private Long totalArtworksThisMonth;

    private List<TopSellingArtworkDTO> topSellingArtworks;

}
