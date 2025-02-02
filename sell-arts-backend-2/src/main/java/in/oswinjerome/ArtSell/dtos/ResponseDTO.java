package in.oswinjerome.ArtSell.dtos;

import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponseDTO {

    private Object data;
    private String message = "";
    private List<Map<String, Object>> errors;
    private boolean success = true;

    public ResponseDTO(Object data, String message, boolean success) {
        this.data = data;
        this.message = message;
        this.success = success;
    }


    public ResponseDTO(Object data, List<Map<String, Object>> errors, boolean success) {
        this.data = data;
        this.errors = errors;
        this.success = success;
    }

      // New constructor for a simple message response
      public ResponseDTO(String message) {
        this.success = true;  // assuming success is true for messages like "successfully deleted"
        this.message = message;
    }


}
