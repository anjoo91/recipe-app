function getAverageRating(reviews) {
    if (reviews.length === 0) {
      return 0;
    }
  
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    const average = sum / reviews.length;
  
    return Math.round(average);
  }
  