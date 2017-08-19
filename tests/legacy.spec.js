import transpile from "../legacy";

describe("legacy transpiler", () => {
  it("removes unnecessary arrays", () => {
    const before = [[220, "@set-freq"], "@pluck", [330, "@set-freq"], "@pluck"];
    const after = [220, "@set-freq", "@pluck", 330, "@set-freq", "@pluck"];
    expect(transpile(before)).toEqual(after);
  });

  describe("right side operations", () => {
    it("transforms @loop", () => {
      const before = ["@loop", ["@pluck", [1, "@wait"]]];
      const after = [["@pluck", 1, "@wait"], "@loop"];
      expect(transpile(before)).toEqual(after);
    });

    it("transforms @fork", () => {
      const before = ["@fork", ["@pluck", [1, "@wait"]]];
      const after = [["@pluck", 1, "@wait"], "@fork"];
      expect(transpile(before)).toEqual(after);
    });

    it("transforms @pick", () => {
      const before = ["@pick", [1, 2, 3]];
      const after = [[1, 2, 3], "@pick"];
      expect(transpile(before)).toEqual(after);
    });
    it("transforms @iter", () => {
      const before = ["@iter", [0.3, 1], "@set-amp"];
      const after = [[0.3, 1], "@iter", "@set-amp"];
      expect(transpile(before)).toEqual(after);
    });
  });

  describe("freq amp note operations", () => {
    it("transforms @pluck-note", () => {
      const before = [440, 0.5, "@pluck-note"];
      const after = [440, 0.5, "@pluck:set-freq", "@pluck:set-amp", "@pluck"];
      expect(transpile(before)).toEqual(after);
    });
  });

  describe("left and right side operations", () => {
    it("transforms @repeat", () => {
      const before = [4, "@repeat", ["@pluck", 1, "@wait"]];
      const after = [["@pluck", 1, "@wait"], 4, "@repeat"];
      expect(transpile(before)).toEqual(after);
    });
  });

  describe("conditional operations", () => {
    it("transforms @chance", () => {
      const before = [0.5, "@chance", ["@kick"], ["@snare"]];
      const after = [["@kick"], ["@snare"], 0.5, "@chance"];
      expect(transpile(before)).toEqual(after);
    });
  });

  describe("real examples", () => {
    it("transforms expressions example", () => {
      const before = [
        "@loop",
        [
          ["@pick", [330, 440, 550, 660]],
          ["@pick", [1, 0.7, 0.4]],
          "@pluck-note",
          0.25,
          "@wait"
        ]
      ];
      const after = [
        [
          [330, 440, 550, 660],
          "@pick",
          [1, 0.7, 0.4],
          "@pick",
          "@pluck:set-freq",
          "@pluck:set-amp",
          "@pluck",
          0.25,
          "@wait"
        ],
        "@loop"
      ];
      expect(transpile(before)).toEqual(after);
    });

    test("Sound example", () => {
      const before = [
        4,
        "@repeat",
        [
          [["@iter", [0.3, 1]], "@set-amp"],
          8,
          "@repeat",
          ["@hat", 0.125, "@wait"]
        ]
      ];
      const after = [
        [[0.3, 1], "@iter", "@set-amp", ["@hat", 0.125, "@wait"], 8, "@repeat"],
        4,
        "@repeat"
      ];
      expect(transpile(before)).toEqual(after);
    });
  });
});
