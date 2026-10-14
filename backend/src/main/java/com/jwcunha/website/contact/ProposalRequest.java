package com.jwcunha.website.contact;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "proposal_request")
public class ProposalRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "full_name", nullable = false, length = 120)
    private String fullName;

    @Column(nullable = false, length = 160)
    private String company;

    @Column(nullable = false, length = 254)
    private String email;

    @Column(length = 40)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "service_area", nullable = false, length = 40)
    private ServiceArea serviceArea;

    @Column(name = "project_location", length = 160)
    private String projectLocation;

    @Column(nullable = false, length = 4000)
    private String message;

    @Column(name = "consent_given", nullable = false)
    private boolean consentGiven;

    @Column(nullable = false, length = 5)
    private String language;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RequestStatus status = RequestStatus.NEW;

    @Enumerated(EnumType.STRING)
    @Column(name = "notification_status", nullable = false, length = 16)
    private NotificationStatus notificationStatus = NotificationStatus.PENDING;

    @Column(name = "notification_attempts", nullable = false)
    private int notificationAttempts;

    @Column(name = "notified_at")
    private Instant notifiedAt;

    @Column(name = "notification_error", length = 300)
    private String notificationError;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    protected ProposalRequest() {
    }

    public ProposalRequest(String fullName, String company, String email, String phone, ServiceArea serviceArea,
            String projectLocation, String message, boolean consentGiven, String language) {
        this.fullName = fullName;
        this.company = company;
        this.email = email;
        this.phone = phone;
        this.serviceArea = serviceArea;
        this.projectLocation = projectLocation;
        this.message = message;
        this.consentGiven = consentGiven;
        this.language = language;
    }

    public void startNotification(boolean emailEnabled) {
        this.notificationStatus = emailEnabled ? NotificationStatus.PENDING : NotificationStatus.DISABLED;
    }

    public void changeStatus(RequestStatus newStatus) {
        this.status = newStatus;
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public String getFullName() { return fullName; }
    public String getCompany() { return company; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public ServiceArea getServiceArea() { return serviceArea; }
    public String getProjectLocation() { return projectLocation; }
    public String getMessage() { return message; }
    public boolean isConsentGiven() { return consentGiven; }
    public String getLanguage() { return language; }
    public RequestStatus getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public NotificationStatus getNotificationStatus() { return notificationStatus; }
    public int getNotificationAttempts() { return notificationAttempts; }
    public Instant getNotifiedAt() { return notifiedAt; }
    public String getNotificationError() { return notificationError; }
}
