import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

export const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
    const { user } = useUser();
    const [subscriptionStatus, setSubscriptionStatus] = useState(null);

    useEffect(() => {
        if (user) {
            checkSubscription(user.primaryEmailAddress?.emailAddress);
        }
    }, [user]);

    const checkSubscription = async (userEmail) => {
        if (!userEmail) return;

        try {
            const response = await axios.get(`/api/check-subscription?email=${userEmail}`);
            setSubscriptionStatus(response.data.status);
            
        } catch (error) {
            console.error("Error checking subscription:", error);
        }
    };

    return (
        <SubscriptionContext.Provider value={{ checkSubscription, subscriptionStatus }}>
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscription = () => {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error("useSubscription must be used within a SubscriptionProvider");
    }
    return context;
};
