package com.petconnect.api.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class ImageService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) throws IOException {
        // Envoi du fichier à Cloudinary
        // "resource_type", "auto" permet de détecter si c'est un jpg, png, etc.
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("resource_type", "auto"));
        
        // On récupère l'URL sécurisée (https) générée par Cloudinary
        return uploadResult.get("secure_url").toString();
    }
}