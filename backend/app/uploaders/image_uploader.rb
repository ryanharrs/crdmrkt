class ImageUploader < CarrierWave::Uploader::Base
  include Cloudinary::CarrierWave

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

  # Use Cloudinary's auto-generated filenames

  # Set the content type
  def content_type_allowlist
    /image\//
  end

  # Limit file size to 10MB
  def size_range
    1.byte..10.megabytes
  end
end
