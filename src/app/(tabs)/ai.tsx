/**
 * AI Assistant Screen — Offside AI
 * Coach AI chat interface with quick actions, tactical reports, and ELI10 toggle.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { AppIcon } from '@/components/ui/AppIcon';
import { AppIcons } from '@/constants/icons';
import { OffsideColors, BorderRadius } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { chatWithCohere, type ChatMessage, type AIMode } from '@/services/cohere';
import { AI_QUICK_ACTIONS } from '@/data/mock';

interface UIMessage extends ChatMessage {
  id: string;
  timestamp: Date;
}

export default function AIScreen() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isELI10, setIsELI10] = useState(false);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: UIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Scroll to bottom
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const chatHistory: ChatMessage[] = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const mode: AIMode = isELI10 ? 'eli10' : 'general';
      const response = await chatWithCohere(chatHistory, mode);

      const aiMessage: UIMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (err) {
      console.error('AI chat error:', err);
      const errorMessage: UIMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I couldn\'t process that request. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, isELI10]);

  const handleQuickAction = (action: typeof AI_QUICK_ACTIONS[number]) => {
    sendMessage(action.label);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.aiAvatar}>
            <AppIcon name={AppIcons.ai} size={22} color={OffsideColors.primaryGreen} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Coach AI</Text>
            <Text style={styles.headerSubtitle}>Football Intelligence</Text>
          </View>
        </View>

        {/* ELI10 Toggle */}
        <Pressable
          onPress={() => setIsELI10(!isELI10)}
          style={[styles.eli10Toggle, isELI10 && styles.eli10ToggleActive]}
        >
          {isELI10 && (
            <AppIcon name={AppIcons.child} size={14} color={OffsideColors.warning} />
          )}
          <Text style={[styles.eli10Text, isELI10 && styles.eli10TextActive]}>ELI10</Text>
        </Pressable>
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome state */}
        {messages.length === 0 && (
          <Animated.View entering={FadeInDown.duration(600)} style={styles.welcomeState}>
            <View style={styles.welcomeAvatar}>
              <AppIcon name={AppIcons.football} size={34} color={OffsideColors.primaryGreen} />
            </View>
            <Text style={styles.welcomeTitle}>Hi Divyanshu,</Text>
            <Text style={styles.welcomeSubtitle}>How can I help you today?</Text>


          </Animated.View>
        )}

        {/* Messages */}
        {messages.map((msg, index) => (
          <Animated.View
            key={msg.id}
            entering={FadeInUp.delay(50).duration(300)}
            style={[
              styles.messageBubble,
              msg.role === 'user' ? styles.userBubble : styles.aiBubble,
            ]}
          >
            {msg.role === 'assistant' && (
              <View style={styles.aiMsgHeader}>
                <AppIcon name={AppIcons.ai} size={13} color={OffsideColors.primaryGreen} />
                <Text style={styles.aiMsgLabel}>Coach AI</Text>
              </View>
            )}
            {msg.role === 'user' ? (
              <Text style={[styles.messageText, styles.userMessageText]}>
                {msg.content}
              </Text>
            ) : (
              <ParsedChatText
                text={msg.content}
                style={[styles.messageText, styles.aiMessageText]}
              />
            )}
          </Animated.View>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <Animated.View entering={FadeInUp.duration(200)} style={[styles.messageBubble, styles.aiBubble]}>
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={OffsideColors.primaryGreen} />
              <Text style={styles.loadingText}>Analyzing...</Text>
            </View>
          </Animated.View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Input Bar */}
      <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask anything about football..."
            placeholderTextColor={OffsideColors.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => sendMessage(inputText)}
            returnKeyType="send"
            multiline
            maxLength={1000}
          />
          <Pressable
            onPress={() => sendMessage(inputText)}
            style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
            disabled={!inputText.trim() || isLoading}
          >
            <AppIcon name={AppIcons.send} size={17} color={OffsideColors.background} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const ParsedChatText = ({ text, style }: { text: string; style?: any }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <Text style={style}>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <Text key={index} style={{ fontWeight: 'bold', color: OffsideColors.textPrimary }}>
              {part.slice(2, -2)}
            </Text>
          );
        }
        return <Text key={index}>{part}</Text>;
      })}
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: OffsideColors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: OffsideColors.cardBorder,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: OffsideColors.primaryGreenDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.cardTitle,
    color: OffsideColors.textPrimary,
  },
  headerSubtitle: {
    ...Typography.bodySmall,
    color: OffsideColors.textSecondary,
    fontSize: 11,
  },
  eli10Toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.round,
    backgroundColor: OffsideColors.card,
    borderWidth: 1,
    borderColor: OffsideColors.cardBorder,
  },
  eli10ToggleActive: {
    backgroundColor: OffsideColors.warningDim,
    borderColor: OffsideColors.warning,
  },
  eli10Text: {
    ...Typography.badge,
    color: OffsideColors.textSecondary,
    fontSize: 11,
  },
  eli10TextActive: {
    color: OffsideColors.warning,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    gap: 12,
  },
  welcomeState: {
    alignItems: 'center',
    paddingTop: 40,
    gap: 8,
  },
  welcomeAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: OffsideColors.primaryGreenDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  welcomeTitle: {
    ...Typography.screenTitle,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    ...Typography.body,
    color: OffsideColors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  quickActions: {
    width: '100%',
    gap: 8,
  },
  quickActionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: OffsideColors.card,
    borderRadius: BorderRadius.md,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: OffsideColors.cardBorder,
  },
  quickActionText: {
    ...Typography.body,
    color: OffsideColors.textPrimary,
    flex: 1,
  },
  messageBubble: {
    maxWidth: '85%',
    borderRadius: BorderRadius.lg,
    padding: 14,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: OffsideColors.secondaryBlue,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: OffsideColors.card,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: OffsideColors.cardBorder,
  },
  aiMsgHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  aiMsgLabel: {
    ...Typography.badge,
    color: OffsideColors.primaryGreen,
    fontSize: 9,
  },
  messageText: {
    ...Typography.body,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: OffsideColors.textSecondary,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    ...Typography.bodySmall,
    color: OffsideColors.primaryGreen,
  },
  inputBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: OffsideColors.cardBorder,
    backgroundColor: OffsideColors.background,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: OffsideColors.card,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: OffsideColors.cardBorder,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  textInput: {
    flex: 1,
    ...Typography.body,
    color: OffsideColors.textPrimary,
    maxHeight: 100,
    paddingVertical: 6,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: OffsideColors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: OffsideColors.textTertiary,
    opacity: 0.5,
  },
});
