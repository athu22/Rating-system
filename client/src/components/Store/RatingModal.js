import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import styled, { keyframes } from 'styled-components';
import { FaStar, FaTimes, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

// Animation keyframes
const flyUp = keyframes`
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(-20px) scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: translateY(-40px) scale(0.8);
    opacity: 0;
  }
`;

const bounceIn = keyframes`
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const SuccessOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(39, 174, 96, 0.95);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  z-index: 10;
  animation: ${bounceIn} 0.6s ease-out;
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  color: white;
  margin-bottom: 1rem;
  animation: ${pulse} 2s infinite;
`;

const SuccessMessage = styled.div`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const SuccessSubmessage = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  text-align: center;
`;

const FlyingStar = styled.div`
  position: absolute;
  color: #f39c12;
  font-size: 1.5rem;
  animation: ${flyUp} 1.5s ease-out forwards;
  pointer-events: none;
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: #2c3e50;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #7f8c8d;
  padding: 0;

  &:hover {
    color: #2c3e50;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const StoreInfo = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
`;

const StoreName = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
`;

const StoreAddress = styled.p`
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const RatingSection = styled.div`
  margin-bottom: 1.5rem;
`;

const RatingLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
`;

const StarRating = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: ${props => props.$filled ? '#f39c12' : '#ddd'};
  transition: color 0.3s ease;

  &:hover {
    color: #f39c12;
  }
`;

const RatingText = styled.div`
  text-align: center;
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const CommentSection = styled.div`
  margin-bottom: 1.5rem;
`;

const CommentLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const ModalFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: #6c757d;
  color: white;

  &:hover:not(:disabled) {
    background: #5a6268;
  }
`;

const SubmitButton = styled(Button)`
  background: #3498db;
  color: white;

  &:hover:not(:disabled) {
    background: #2980b9;
  }
`;

const RatingModal = ({ store, existingRating, isOpen, onClose, onSubmit }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(existingRating ? existingRating.rating : 0);
  const [comment, setComment] = useState(existingRating ? existingRating.comment || '' : '');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [flyingStars, setFlyingStars] = useState([]);

  // Update form when existingRating changes
  React.useEffect(() => {
    if (existingRating) {
      setRating(existingRating.rating);
      setComment(existingRating.comment || '');
    } else {
      setRating(0);
      setComment('');
    }
  }, [existingRating]);

  const submitRatingMutation = useMutation(
    async (ratingData) => {
      if (existingRating) {
        // Update existing rating
        const response = await api.put(`/ratings/${existingRating.id}`, ratingData);
        return response.data;
      } else {
        // Create new rating
        const response = await api.post('/ratings', ratingData);
        return response.data;
      }
    },
    {
      onSuccess: () => {
        // Create flying stars animation
        const stars = [];
        for (let i = 0; i < 5; i++) {
          stars.push({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 0.5,
          });
        }
        setFlyingStars(stars);

        // Show success overlay
        setShowSuccess(true);

        // Hide success overlay and close modal after animation
        setTimeout(() => {
          setShowSuccess(false);
          setFlyingStars([]);
          const message = existingRating ? 'Rating updated successfully!' : 'Rating submitted successfully!';
          toast.success(message);
          queryClient.invalidateQueries(['stores']);
          queryClient.invalidateQueries(['userRatings']);
          onSubmit();
        }, 2000);
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to submit rating';
        toast.error(message);
      },
    }
  );

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    const ratingData = {
      store_id: store.id,
      rating,
      comment,
    };

    submitRatingMutation.mutate(ratingData);
  };

  const handleClose = () => {
    setRating(existingRating ? existingRating.rating : 0);
    setComment(existingRating ? existingRating.comment || '' : '');
    setHoveredRating(0);
    setShowSuccess(false);
    setFlyingStars([]);
    onClose();
  };

  if (!isOpen) return null;

  const getRatingText = (rating) => {
    const texts = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent',
    };
    return texts[rating] || 'Select a rating';
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        {/* Flying stars animation */}
        {flyingStars.map((star) => (
          <FlyingStar
            key={star.id}
            style={{
              left: `${star.left}%`,
              animationDelay: `${star.delay}s`,
            }}
          >
            <FaStar />
          </FlyingStar>
        ))}

        {/* Success overlay */}
        {showSuccess && (
          <SuccessOverlay>
            <SuccessIcon>
              <FaStar />
            </SuccessIcon>
            <SuccessMessage>
              {existingRating ? 'Rating Updated!' : 'Rating Submitted!'}
            </SuccessMessage>
            <SuccessSubmessage>
              Thank you for your feedback!
            </SuccessSubmessage>
          </SuccessOverlay>
        )}

        <ModalHeader>
          <ModalTitle>{existingRating ? 'Update Rating' : 'Rate Store'}</ModalTitle>
          <CloseButton onClick={handleClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <StoreInfo>
            <StoreName>{store.name}</StoreName>
            <StoreAddress>{store.address}</StoreAddress>
          </StoreInfo>

          <RatingSection>
            <RatingLabel>Your Rating</RatingLabel>
            <StarRating>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarButton
                  key={star}
                  $filled={star <= (hoveredRating || rating)}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  <FaStar />
                </StarButton>
              ))}
            </StarRating>
            <RatingText>{getRatingText(hoveredRating || rating)}</RatingText>
          </RatingSection>

          <CommentSection>
            <CommentLabel>Comment (Optional)</CommentLabel>
            <CommentTextarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this store..."
              maxLength={1000}
            />
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#7f8c8d', marginTop: '0.5rem' }}>
              {comment.length}/1000 characters
            </div>
          </CommentSection>
        </ModalBody>

        <ModalFooter>
          <CancelButton onClick={handleClose} disabled={submitRatingMutation.isLoading}>
            Cancel
          </CancelButton>
          <SubmitButton
            onClick={handleSubmit}
            disabled={submitRatingMutation.isLoading || rating === 0}
          >
            {submitRatingMutation.isLoading ? (
              <>
                <FaSpinner className="loading-spinner" />
                {existingRating ? 'Updating...' : 'Submitting...'}
              </>
            ) : (
              existingRating ? 'Update Rating' : 'Submit Rating'
            )}
          </SubmitButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default RatingModal; 