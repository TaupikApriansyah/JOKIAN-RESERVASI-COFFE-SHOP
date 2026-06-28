package reservasi.coffeshop.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cafe_tables")
public class CafeTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(nullable = false, length = 40)
    private String area;

    @Column(length = 20)
    private String floor = "Lantai 1";

    @Column(nullable = false)
    private int capacity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TablePhysicalStatus physicalStatus = TablePhysicalStatus.AVAILABLE;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
    public String getFloor() { return floor == null || floor.isBlank() ? "Lantai 1" : floor; }
    public void setFloor(String floor) { this.floor = floor; }
    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
    public TablePhysicalStatus getPhysicalStatus() { return physicalStatus; }
    public void setPhysicalStatus(TablePhysicalStatus physicalStatus) { this.physicalStatus = physicalStatus; }
}
