const slugify = require('slugify');

// Middleware function to generate slug
function generateSlug(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = slugify(this.name, {
      lower: true,        // Convert to lowercase
      strict: true,       // Remove special characters
      replacement: '-',   // Replace spaces with hyphens
    });
  }
  
  next();
}

module.exports = {
  generateSlug,
};
