/**
 * Trip Hub Configuration Service
 * Manages trip hub settings, suggestions, and recommendations
 */

class TripHubConfigService {
  constructor() {
    this.db = firebase.firestore();
    this.configurations = new Map(); // Cache configurations
  }

  /**
   * Load configuration for a trip
   * @param {string} tripId - Trip ID
   * @returns {Promise<Object>} Configuration object
   */
  async loadConfiguration(tripId) {
    try {
      // Check cache first
      if (this.configurations.has(tripId)) {
        return this.configurations.get(tripId);
      }

      const doc = await this.db
        .collection('tripHubConfigurations')
        .doc(tripId)
        .get();

      const config = doc.exists ? doc.data() : this.getDefaultConfiguration();

      // Cache it
      this.configurations.set(tripId, config);

      return config;
    } catch (error) {
      console.error('Error loading trip hub configuration:', error);
      return this.getDefaultConfiguration();
    }
  }

  /**
   * Get default configuration
   * @returns {Object} Default configuration
   */
  getDefaultConfiguration() {
    return {
      dismissedSuggestions: [],
      esimState: 'notPurchased', // notPurchased, purchased, installed, activated
      esimReminderDate: null,
      transportReminderDate: null,
      transferReminderDate: null,
      emailImportReminderDate: null,
      hasDeclinedCompanionInvite: false,
      hideCompanionsWidget: false,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
  }

  /**
   * Dismiss a suggestion
   * @param {string} tripId - Trip ID
   * @param {string} suggestionId - Suggestion identifier (esim, asiatransport, airportTransfer, emailImport)
   */
  async dismissSuggestion(tripId, suggestionId) {
    try {
      const user = firebase.auth().currentUser;
      if (!user) return;

      await this.db
        .collection('tripHubConfigurations')
        .doc(tripId)
        .set(
          {
            userId: user.uid,
            dismissedSuggestions: firebase.firestore.FieldValue.arrayUnion(suggestionId),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          },
          { merge: true }
        );

      // Update cache
      const config = await this.loadConfiguration(tripId);
      config.dismissedSuggestions.push(suggestionId);
      this.configurations.set(tripId, config);
    } catch (error) {
      console.error('Error dismissing suggestion:', error);
    }
  }

  /**
   * Set reminder for a suggestion
   * @param {string} tripId - Trip ID
   * @param {string} suggestionId - Suggestion identifier
   * @param {Date} reminderDate - Date to remind
   */
  async setReminder(tripId, suggestionId, reminderDate) {
    try {
      const user = firebase.auth().currentUser;
      if (!user) return;

      const fieldName = `${suggestionId}ReminderDate`;

      await this.db
        .collection('tripHubConfigurations')
        .doc(tripId)
        .set(
          {
            userId: user.uid,
            [fieldName]: firebase.firestore.Timestamp.fromDate(reminderDate),
            dismissedSuggestions: firebase.firestore.FieldValue.arrayUnion(suggestionId),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          },
          { merge: true }
        );

      // Update cache
      const config = await this.loadConfiguration(tripId);
      config[fieldName] = firebase.firestore.Timestamp.fromDate(reminderDate);
      config.dismissedSuggestions.push(suggestionId);
      this.configurations.set(tripId, config);
    } catch (error) {
      console.error('Error setting reminder:', error);
    }
  }

  /**
   * Check if reminder is due and should show suggestion again
   * @param {string} tripId - Trip ID
   * @param {string} suggestionId - Suggestion identifier
   * @returns {Promise<boolean>} True if reminder is due
   */
  async clearReminderIfDue(tripId, suggestionId) {
    try {
      const config = await this.loadConfiguration(tripId);
      const fieldName = `${suggestionId}ReminderDate`;
      const reminderDate = config[fieldName];

      if (!reminderDate) return false;

      const now = new Date();
      const reminderTimestamp = reminderDate.toDate ? reminderDate.toDate() : new Date(reminderDate);

      if (reminderTimestamp <= now) {
        // Reminder is due - remove from dismissed and clear reminder date
        const user = firebase.auth().currentUser;
        if (!user) return false;

        await this.db
          .collection('tripHubConfigurations')
          .doc(tripId)
          .set(
            {
              userId: user.uid,
              dismissedSuggestions: config.dismissedSuggestions.filter(id => id !== suggestionId),
              [fieldName]: null,
              updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            },
            { merge: true }
          );

        // Clear cache to force reload
        this.configurations.delete(tripId);

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error checking reminder:', error);
      return false;
    }
  }

  /**
   * Update eSIM state
   * @param {string} tripId - Trip ID
   * @param {string} state - New state (notPurchased, purchased, installed, activated)
   */
  async updateESIMState(tripId, state) {
    try {
      const user = firebase.auth().currentUser;
      if (!user) return;

      await this.db
        .collection('tripHubConfigurations')
        .doc(tripId)
        .set(
          {
            userId: user.uid,
            esimState: state,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          },
          { merge: true }
        );

      // Update cache
      const config = await this.loadConfiguration(tripId);
      config.esimState = state;
      this.configurations.set(tripId, config);
    } catch (error) {
      console.error('Error updating eSIM state:', error);
    }
  }

  /**
   * Decline companion invite
   * @param {string} tripId - Trip ID
   */
  async declineCompanionInvite(tripId) {
    try {
      const user = firebase.auth().currentUser;
      if (!user) return;

      await this.db
        .collection('tripHubConfigurations')
        .doc(tripId)
        .set(
          {
            userId: user.uid,
            hasDeclinedCompanionInvite: true,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          },
          { merge: true }
        );

      // Update cache
      const config = await this.loadConfiguration(tripId);
      config.hasDeclinedCompanionInvite = true;
      this.configurations.set(tripId, config);
    } catch (error) {
      console.error('Error declining companion invite:', error);
    }
  }

  /**
   * Hide companions widget
   * @param {string} tripId - Trip ID
   */
  async hideCompanionsWidget(tripId) {
    try {
      const user = firebase.auth().currentUser;
      if (!user) return;

      await this.db
        .collection('tripHubConfigurations')
        .doc(tripId)
        .set(
          {
            userId: user.uid,
            hideCompanionsWidget: true,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          },
          { merge: true }
        );

      // Update cache
      const config = await this.loadConfiguration(tripId);
      config.hideCompanionsWidget = true;
      this.configurations.set(tripId, config);
    } catch (error) {
      console.error('Error hiding companions widget:', error);
    }
  }

  /**
   * Check if suggestion should be shown
   * @param {string} tripId - Trip ID
   * @param {string} suggestionId - Suggestion identifier
   * @returns {Promise<boolean>} True if should show
   */
  async shouldShowSuggestion(tripId, suggestionId) {
    const config = await this.loadConfiguration(tripId);

    // Check if reminder is due
    await this.clearReminderIfDue(tripId, suggestionId);

    // Reload config after potential reminder clear
    const updatedConfig = await this.loadConfiguration(tripId);

    return !updatedConfig.dismissedSuggestions.includes(suggestionId);
  }

  /**
   * Clear all caches (useful after updates)
   */
  clearCache() {
    this.configurations.clear();
  }
}

// Create global instance
window.tripHubConfigService = new TripHubConfigService();
