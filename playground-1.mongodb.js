// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('test'); // Pastikan pakai database yang benar

// Find a document in a collection.
db.driverstatuses.find({
  status: "online",
  currentLocation: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [110.3819, -7.7864]
      },
      $maxDistance: 5000 // meter
    }
  }
}).limit(10)
