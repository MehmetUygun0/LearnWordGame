// WordleGame.tsx — React Native Wordle
// Works with Expo (expo start) or bare React Native CLI.
// Change API_BASE to your C# backend URL.

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import config from "../../lib/config";
import { useAuth } from "../../lib/auth-context";

// ── Config ──────────────────────────────────────────────────────────
const API_BASE = config.API_URL;
const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;

// ── Types ────────────────────────────────────────────────────────────
type TileStatus = "correct" | "present" | "absent" | "tbd" | "empty";

interface Tile {
  letter: string;
  status: TileStatus;
}

interface LetterResult {
  letter: string;
  status: "correct" | "present" | "absent";
}

interface GuessResult {
  result: LetterResult[];
  gameOver: boolean;
  won: boolean;
  attemptsUsed: number;
  maxAttempts: number;
  answer?: string;
}

// ── Keyboard rows ────────────────────────────────────────────────────
const KEYBOARD_ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","⌫"],
];

// ── Colour palette ───────────────────────────────────────────────────
const C = {
  bg:        "#0d1117",
  surface:   "#161b22",
  border:    "#30363d",
  correct:   "#538d4e",
  present:   "#b59f3b",
  absent:    "#3d444d",
  key:       "#21262d",
  keyText:   "#e6edf3",
  text:      "#e6edf3",
  muted:     "#8b949e",
  white:     "#ffffff",
  danger:    "#da3633",
  accent:    "#1f6feb",
};

// ──────────────────────────────────────────────────────────────────────
// Main component
// ──────────────────────────────────────────────────────────────────────
export default function WordleGame() {
  const { token } = useAuth();
  const [gameId, setGameId]         = useState<string | null>(null);
  const [board, setBoard]           = useState<Tile[][]>(emptyBoard());
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [keyColors, setKeyColors]   = useState<Record<string, TileStatus>>({});
  const [gameOver, setGameOver]     = useState(false);
  const [won, setWon]               = useState(false);
  const [answer, setAnswer]         = useState<string | null>(null);
  const [message, setMessage]       = useState("");
  const [loading, setLoading]       = useState(false);

  // Flip animations — one per tile
  const flipAnims = useRef<Animated.Value[][]>(
    Array.from({ length: MAX_ATTEMPTS }, () =>
      Array.from({ length: WORD_LENGTH }, () => new Animated.Value(0))
    )
  ).current;

  // Shake animation for invalid guess row
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // ── Start / restart game ─────────────────────────────────────────
  const startGame = useCallback(async () => {
    setLoading(true);
    setBoard(emptyBoard());
    setCurrentRow(0);
    setCurrentCol(0);
    setKeyColors({});
    setGameOver(false);
    setWon(false);
    setAnswer(null);
    setMessage("");
    // Reset flip anims
    flipAnims.forEach(row => row.forEach(a => a.setValue(0)));

    try {
      const res  = await fetch(`${API_BASE}/api/wordle/new-game`, {
        headers: token && token !== "demo-session" ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();

      if (!res.ok) {
        showMessage(data?.error ?? "Wordle icin uygun kelime bulunamadi", 3000);
        return;
      }

      setGameId(data.gameId);
    } catch {
      showMessage("Could not connect to server", 3000);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { startGame(); }, [startGame]);

  // ── Key press ────────────────────────────────────────────────────
  const handleKey = useCallback((key: string) => {
    if (gameOver || loading) return;

    if (key === "⌫" || key === "BACKSPACE") {
      setBoard(prev => {
        const next = copyBoard(prev);
        if (currentCol > 0) {
          next[currentRow][currentCol - 1] = { letter: "", status: "empty" };
          setCurrentCol(c => c - 1);
        }
        return next;
      });
      return;
    }

    if (key === "ENTER") {
      submitGuess();
      return;
    }

    if (currentCol < WORD_LENGTH && /^[A-Z]$/.test(key)) {
      setBoard(prev => {
        const next = copyBoard(prev);
        next[currentRow][currentCol] = { letter: key, status: "tbd" };
        return next;
      });
      setCurrentCol(c => c + 1);
    }
  }, [currentRow, currentCol, gameOver, loading]);

  // ── Submit guess ─────────────────────────────────────────────────
  const submitGuess = useCallback(async () => {
    if (currentCol < WORD_LENGTH) {
      shake();
      showMessage("Not enough letters", 1500);
      return;
    }
    if (!gameId) return;

    const guess = board[currentRow].map(t => t.letter).join("").toLowerCase();

    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/api/wordle/guess`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && token !== "demo-session" ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ gameId, guess }),
      });
      const data: GuessResult = await res.json();

      if (!data.result || data.result.length === 0) {
        shake();
        showMessage("Invalid word", 1500);
        setLoading(false);
        return;
      }

      // Apply results to board
      setBoard(prev => {
        const next = copyBoard(prev);
        data.result.forEach((lr, i) => {
          next[currentRow][i] = { letter: lr.letter.toUpperCase(), status: lr.status };
        });
        return next;
      });

      // Animate flip
      animateRow(currentRow, () => {
        // Update key colours after flip
        setKeyColors(prev => {
          const next = { ...prev };
          const priority = { correct: 3, present: 2, absent: 1 };
          data.result.forEach(lr => {
            const k = lr.letter.toUpperCase();
            const cur = next[k];
            if (!cur || priority[lr.status] > priority[cur as keyof typeof priority]) {
              next[k] = lr.status;
            }
          });
          return next;
        });

        if (data.gameOver) {
          setGameOver(true);
          setWon(data.won);
          if (data.answer) setAnswer(data.answer.toUpperCase());
          showMessage(data.won ? "Brilliant! 🎉" : `The word was ${data.answer?.toUpperCase()}`, 4000);
        } else {
          setCurrentRow(r => r + 1);
          setCurrentCol(0);
        }
        setLoading(false);
      });
    } catch {
      showMessage("Server error — check connection", 2500);
      setLoading(false);
    }
  }, [gameId, board, currentRow, currentCol, token]);

  // ── Helpers ──────────────────────────────────────────────────────
  const showMessage = (msg: string, duration = 2000) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), duration);
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 6,  duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue:-6,  duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 4,  duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue:-4,  duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,  duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const animateRow = (row: number, onDone: () => void) => {
    const anims = flipAnims[row].map((anim, i) =>
      Animated.sequence([
        Animated.delay(i * 120),
        Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ])
    );
    Animated.parallel(anims).start(onDone);
  };

  // ── Tile component ───────────────────────────────────────────────
  const renderTile = (tile: Tile, rowIdx: number, colIdx: number) => {
    const anim = flipAnims[rowIdx][colIdx];

    const rotate = anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ["0deg", "90deg", "0deg"],
    });

    const bgColor = anim.interpolate({
      inputRange: [0, 0.5, 0.51, 1],
      outputRange: [
        tile.status === "tbd" ? C.surface : statusBg(tile.status),
        statusBg(tile.status),
        statusBg(tile.status),
        statusBg(tile.status),
      ],
    });

    const borderColor = tile.letter
      ? tile.status === "tbd" ? C.muted : statusBg(tile.status)
      : C.border;

    return (
      <Animated.View
        key={colIdx}
        style={[
          styles.tile,
          {
            backgroundColor: bgColor as any,
            borderColor,
            transform: [{ rotateX: rotate }],
          },
        ]}
      >
        <Text style={styles.tileLetter}>{tile.letter}</Text>
      </Animated.View>
    );
  };

  // ── Keyboard key ─────────────────────────────────────────────────
  const renderKey = (key: string) => {
    const isWide  = key === "ENTER" || key === "⌫";
    const status  = keyColors[key];
    const bg      = status ? statusBg(status) : C.key;
    const fgColor = (status === "absent") ? C.muted : C.keyText;

    return (
      <TouchableOpacity
        key={key}
        style={[styles.key, isWide && styles.keyWide, { backgroundColor: bg }]}
        onPress={() => handleKey(key)}
        activeOpacity={0.7}
      >
        <Text style={[styles.keyLabel, { color: fgColor }, isWide && styles.keyLabelWide]}>
          {key}
        </Text>
      </TouchableOpacity>
    );
  };

  // ── Render ───────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>WORDLE</Text>
        <TouchableOpacity onPress={startGame} style={styles.newGameBtn}>
          <Text style={styles.newGameText}>New Game</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />

      {/* Toast */}
      {message ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{message}</Text>
        </View>
      ) : null}

      {/* Board */}
      <View style={styles.boardArea}>
        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          {board.map((row, rowIdx) => (
            <View key={rowIdx} style={styles.row}>
              {row.map((tile, colIdx) => renderTile(tile, rowIdx, colIdx))}
            </View>
          ))}
        </Animated.View>
      </View>

      {/* Keyboard */}
      <View style={styles.keyboard}>
        {KEYBOARD_ROWS.map((row, i) => (
          <View key={i} style={styles.keyRow}>
            {row.map(renderKey)}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

// ── Utilities ────────────────────────────────────────────────────────
function emptyBoard(): Tile[][] {
  return Array.from({ length: MAX_ATTEMPTS }, () =>
    Array.from({ length: WORD_LENGTH }, () => ({ letter: "", status: "empty" as TileStatus }))
  );
}

function copyBoard(b: Tile[][]): Tile[][] {
  return b.map(row => row.map(tile => ({ ...tile })));
}

function statusBg(status: TileStatus | undefined): string {
  switch (status) {
    case "correct": return C.correct;
    case "present": return C.present;
    case "absent":  return C.absent;
    default:        return C.surface;
  }
}

// ── Styles ───────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    color: C.text,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 6,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  newGameBtn: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  newGameText: {
    color: C.muted,
    fontSize: 13,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginHorizontal: 16,
  },
  toast: {
    position: "absolute",
    top: 80,
    alignSelf: "center",
    backgroundColor: C.text,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 99,
  },
  toastText: {
    color: C.bg,
    fontWeight: "700",
    fontSize: 14,
  },
  boardArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
  },
  tile: {
    width: 58,
    height: 58,
    margin: 3,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  tileLetter: {
    color: C.text,
    fontSize: 26,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  keyboard: {
    paddingHorizontal: 6,
    paddingBottom: Platform.OS === "ios" ? 20 : 14,
  },
  keyRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
  },
  key: {
    minWidth: 34,
    height: 56,
    marginHorizontal: 3,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  keyWide: {
    minWidth: 56,
    paddingHorizontal: 10,
  },
  keyLabel: {
    fontSize: 15,
    fontWeight: "700",
  },
  keyLabelWide: {
    fontSize: 12,
  },
});
