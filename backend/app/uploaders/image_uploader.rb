class ImageUploader < CarrierWave::Uploader::Base
  include Cloudinary::CarrierWave

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

  # Process files as they are uploaded:
  process convert: 'jpg'
  process tags: ['hockey_card']

  # Create different versions of your uploaded files:
  version :thumbnail do
    resize_to_fill 300, 200
    cloudinary_transformation quality: 'auto', fetch_format: 'auto'
  end

  version :medium do
    resize_to_fill 600, 400
    cloudinary_transformation quality: 'auto', fetch_format: 'auto'
  end

  version :large do
    resize_to_fill 1200, 800
    cloudinary_transformation quality: 'auto', fetch_format: 'auto'
  end

  # Add a white list of extensions which are allowed to be uploaded.
  def extension_allowlist
    %w(jpg jpeg gif png webp)
  end

  # Override the filename of the uploaded files:
  def filename
    if original_filename
      "#{secure_token}.#{file.extension}" if file
    end
  end

  # Generate a unique token for the filename
  def secure_token
    var = :"@#{mounted_as}_secure_token"
    model.instance_variable_get(var) or model.instance_variable_set(var, SecureRandom.uuid)
  end

  # Set the content type
  def content_type_allowlist
    /image\//
  end

  # Limit file size to 10MB
  def size_range
    1.byte..10.megabytes
  end
end
