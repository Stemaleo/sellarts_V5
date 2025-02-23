package in.oswinjerome.ArtSell.exceptions;

public class UnAuthorizedActionException extends RuntimeException {
    public UnAuthorizedActionException(String message) {
        super(message);
    }
}
