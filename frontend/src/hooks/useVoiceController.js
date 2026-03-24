import { useNavigate } from 'react-router-dom';
import { useRef, useCallback, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const useVoiceController = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  
  const [uploadState, setUploadState] = useState({
    step: 'IDLE',
    selectedFile: null,
    isFormActive: false,
    currentQuestion: null,
    formData: {
      title: '',
      category: '',
      description: '',
      budget: '',
      duration: ''
    },
    automationStep: 0,
    
    // Freelancer profile automation state
    profileStep: 'IDLE', 
    profileQuestionIndex: 0,
    profileData: {
      businessName: '',
      location: '',
      description: '',
      contactEmail: '',
      phoneNumber: '',
      skills: '',
      experience: ''
    }
  });

  useEffect(() => {
    const handlePageChange = () => {
      if (uploadState.step !== 'IDLE' && uploadState.step !== 'COMPLETED') {
        console.log('🔄 Page changed, resetting automation');
        resetAutomation();
      }
    };

    window.addEventListener('popstate', handlePageChange);
    return () => window.removeEventListener('popstate', handlePageChange);
  }, [uploadState.step]);

  const resetAutomation = useCallback(() => {
    setUploadState({
      step: 'IDLE',
      selectedFile: null,
      isFormActive: false,
      currentQuestion: null,
      formData: {
        title: '',
        category: '',
        description: '',
        budget: '',
        duration: ''
      },
      automationStep: 0,
      profileStep: 'IDLE',
      profileQuestionIndex: 0,
      profileData: {
        businessName: '',
        location: '',
        description: '',
        contactEmail: '',
        phoneNumber: '',
        skills: '',
        experience: ''
      }
    });
  }, []);

  const handleNavigation = useCallback((route, speak) => {
    console.log('🧭 Navigating to:', route);
    navigate(route);
    const msg = route === '/marketplace' ? 'Opening Marketplace' : 
                route === '/dashboard' ? 'Opening Freelancer Dashboard' : 
                route === '/client-dashboard' ? 'Opening Client Ecosystem' :
                route === '/profile' ? 'Opening Profile' : `Navigating to ${route}`;
    speak?.(msg);
  }, [navigate]);

  const handleLogout = useCallback((speak) => {
    speak?.('Logging out safely...');
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const executeAction = useCallback(async (action, speak, userText = '') => {
    if (!action) return;

    console.log('🎯 Executing action:', action.type);

    try {
      switch (action.type) {
        case 'NAVIGATE':
          handleNavigation(action.params.route, speak);
          break;

        case 'LOGOUT':
          handleLogout(speak);
          break;

        case 'START_BIDDING':
          speak?.('Opening Bidding Arena for this project.');
          // Logic to trigger bid modal if project is selected
          const bidBtn = document.querySelector('[data-automation="init-bid"]');
          if (bidBtn) bidBtn.click();
          break;

        case 'QUERY_KNOWLEDGE_BASE':
          speak?.('Activating Living Knowledge Base Assistant.');
          const kbToggle = document.querySelector('[data-automation="kb-toggle"]');
          if (kbToggle) kbToggle.click();
          break;

        case 'SET_BID_AMOUNT':
          const amount = action.params?.value || userText.match(/\d+/)?.[0];
          if (amount) {
            const input = document.querySelector('input[type="number"]');
            if (input) {
              input.value = amount;
              input.dispatchEvent(new Event('input', { bubbles: true }));
              speak?.(`Setting bid amount to ${amount}`);
            }
          }
          break;

        case 'SUBMIT_PROPOSAL':
          const submitBtn = document.querySelector('[data-automation="transmit-proposal"]');
          if (submitBtn) {
            speak?.('Transmitting your contextual proposal now.');
            submitBtn.click();
          }
          break;

        case 'CANCEL':
          speak?.('Action cancelled.');
          resetAutomation();
          break;

        default:
          console.log('❓ Unknown action type:', action.type);
          speak?.('I am not sure how to do that yet.');
      }
    } catch (error) {
      console.error('❌ Action execution error:', error);
      speak?.('I encountered a technical glitch.');
    }
  }, [handleNavigation, handleLogout, resetAutomation]);

  return {
    executeAction,
    uploadState,
    setUploadState,
    resetAutomation
  };
};

export default useVoiceController;
