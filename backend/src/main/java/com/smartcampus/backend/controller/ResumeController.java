package com.smartcampus.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    private final Path uploadDirectory =
            Paths.get("uploads/resumes");

    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<String> uploadResume(
            @RequestParam("file") MultipartFile file)
            throws IOException {

        if (file.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Please select a resume file");
        }

        String originalFilename =
                file.getOriginalFilename();

        if (originalFilename == null ||
                !originalFilename.toLowerCase().endsWith(".pdf")) {

            return ResponseEntity
                    .badRequest()
                    .body("Only PDF files are allowed");
        }

        /*
         * Create upload directory if it does not exist.
         */
        Files.createDirectories(uploadDirectory);

        /*
         * Generate a unique filename.
         */
        String filename =
                UUID.randomUUID() + ".pdf";

        Path filePath =
                uploadDirectory.resolve(filename);

        /*
         * Save the uploaded file.
         */
        Files.copy(
                file.getInputStream(),
                filePath
        );

        /*
         * Return the URL that can later be
         * stored in the application.
         */
        String fileUrl =
                "/uploads/resumes/" + filename;

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(fileUrl);
    }
}