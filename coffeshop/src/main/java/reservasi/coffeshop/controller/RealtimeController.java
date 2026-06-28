package reservasi.coffeshop.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import reservasi.coffeshop.service.RealtimeService;

@RestController
@RequestMapping("/api/realtime")
public class RealtimeController {
    private final RealtimeService realtimeService;

    public RealtimeController(RealtimeService realtimeService) {
        this.realtimeService = realtimeService;
    }

    @GetMapping("/stream")
    public SseEmitter stream() {
        return realtimeService.subscribe();
    }
}
