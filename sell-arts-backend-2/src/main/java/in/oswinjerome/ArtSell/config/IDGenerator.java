package in.oswinjerome.ArtSell.config;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

import java.util.Random;

public class IDGenerator implements IdentifierGenerator {
    private static final Random random = new Random();

    @Override
    public Object generate(SharedSessionContractImplementor sharedSessionContractImplementor, Object o) {
        return generateRandom8DigitId();
    }
    private Long generateRandom8DigitId() {
        // Generates an 8-digit number, ensuring it's between 10000000 and 99999999
        return 10000000 + (long) (random.nextDouble() * 90000000);
    }
}
