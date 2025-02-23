package in.oswinjerome.ArtSell.exceptions;

import com.fasterxml.jackson.core.JsonProcessingException;

import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.net.ConnectException;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseDTO> handleGenericException(Exception ex) {
        System.out.println("HELLO ############### "+ex.getLocalizedMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ResponseDTO.builder().success(false).message(ex.getMessage()).build());
    }
 @ExceptionHandler(JsonProcessingException.class)
    public ResponseEntity<ResponseDTO> handleJsonProcessingException(JsonProcessingException ex) {
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(ResponseDTO.builder().success(false).message(ex.getLocalizedMessage()).build());
    }

   @ExceptionHandler(UnAuthorizedActionException.class)
   @ResponseBody
    public ResponseEntity<ResponseDTO> handleUnAuthorizedActionException(UnAuthorizedActionException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ResponseDTO.builder().success(false).message(ex.getMessage()).build());
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
   @ResponseBody
    public ResponseEntity<ResponseDTO> handleAuthorizationDeniedException(AuthorizationDeniedException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ResponseDTO.builder().success(false).message(ex.getMessage()).build());
    }



    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ResponseBody
    public ResponseEntity<ResponseDTO> handleException(MethodArgumentNotValidException exception) {

        List<Map<String, Object>> sanitizedErrors = exception.getFieldErrors().stream()
                .map(fieldError -> {
                    Map<String, Object> errorDetails = new HashMap<>();
                    errorDetails.put("field", fieldError.getField());
                    errorDetails.put("errorMessage", fieldError.getDefaultMessage());
                    return errorDetails;
                })
                .toList();

        return new ResponseEntity<>(new ResponseDTO(null,sanitizedErrors,false), HttpStatus.UNPROCESSABLE_ENTITY);
    }


    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ResponseBody
    public ResponseEntity<ResponseDTO> handleEntityNotFoundException(EntityNotFoundException exception) {


        return new ResponseEntity<>(new ResponseDTO(null,exception.getMessage(),false), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DuplicateKeyException.class)
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    @ResponseBody
    public ResponseEntity<ResponseDTO> handleDuplicate(DuplicateKeyException exception) {


        return new ResponseEntity<>(new ResponseDTO(null,exception.getMessage(),false), HttpStatus.UNPROCESSABLE_ENTITY);
    }

    @ExceptionHandler(InvalidDataException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ResponseBody
    public ResponseEntity<ResponseDTO> handleInvalidDataException(InvalidDataException exception) {


        return new ResponseEntity<>(new ResponseDTO(null,exception.getMessage(),false), HttpStatus.UNPROCESSABLE_ENTITY);
    }


  @ExceptionHandler(ConnectException.class)
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    @ResponseBody
    public ResponseEntity<ResponseDTO> handleConnectException(ConnectException exception) {

        return new ResponseEntity<>(new ResponseDTO(null,"Connection Refused",false), HttpStatus.UNPROCESSABLE_ENTITY);
    }


    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    @ResponseBody
    public ResponseEntity<ResponseDTO> handleConnectException(HttpMessageNotReadableException exception) {

        return new ResponseEntity<>(new ResponseDTO(null,exception.getMessage(),false), HttpStatus.UNPROCESSABLE_ENTITY);
    }

}
