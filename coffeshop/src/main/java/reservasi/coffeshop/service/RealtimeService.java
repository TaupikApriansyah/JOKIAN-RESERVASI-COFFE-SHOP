package reservasi.coffeshop.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class RealtimeService {
    private static final Logger log = LoggerFactory.getLogger(RealtimeService.class);
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(0L);
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError(error -> emitters.remove(emitter));
        send(emitter, "connected");
        return emitter;
    }

    public void publish(String eventType) {
        for (SseEmitter emitter : emitters) {
            if (!send(emitter, eventType)) {
                emitters.remove(emitter);
            }
        }
    }

    private boolean send(SseEmitter emitter, String eventType) {
        try {
            emitter.send(SseEmitter.event()
                    .name("brewvibe-update")
                    .data(Map.of("type", eventType, "time", LocalDateTime.now().toString())));
            return true;
        } catch (IOException | IllegalStateException ex) {
            log.debug("Realtime client disconnected: {}", ex.getMessage());
            return false;
        }
    }
}
