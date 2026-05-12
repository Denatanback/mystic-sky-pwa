const STARS = [
  { cls: "s1",    left: 30,  top: 40,  delay: 0    },
  { cls: "s2 lg", left: 94,  top: 88,  delay: 0.8  },
  { cls: "s3",    left: 182, top: 42,  delay: 1.4  },
  { cls: "s1 lg", left: 318, top: 60,  delay: 0.3  },
  { cls: "s2",    left: 386, top: 114, delay: 2.1  },
  { cls: "s3",    left: 54,  top: 190, delay: 0.6  },
  { cls: "s1",    left: 360, top: 218, delay: 1.7  },
  { cls: "s2",    left: 116, top: 274, delay: 0.9  },
  { cls: "s1",    left: 284, top: 312, delay: 2.4  },
  { cls: "s2",    left: 38,  top: 398, delay: 1.1  },
  { cls: "s3",    left: 394, top: 428, delay: 0.4  },
  { cls: "s1",    left: 74,  top: 548, delay: 1.9  },
  { cls: "s2",    left: 342, top: 610, delay: 0.7  },
  { cls: "s3",    left: 158, top: 688, delay: 2.6  },
  { cls: "s1",    left: 40,  top: 780, delay: 1.3  },
  { cls: "s2",    left: 372, top: 812, delay: 0.2  },
  { cls: "s1",    left: 212, top: 146, delay: 1.6  },
  { cls: "s1",    left: 245, top: 508, delay: 2.8  },
  { cls: "s3",    left: 316, top: 742, delay: 1.0  },
];

export function StarField({ orbits = true }: { orbits?: boolean }) {
  return (
    <div className="starfield" aria-hidden="true">
      {orbits && (
        <>
          <div className="orbit" />
          <div className="orbit two" />
        </>
      )}
      {STARS.map((s, i) => (
        <span
          key={i}
          className={`star ${s.cls}`}
          style={{
            left: s.left,
            top: s.top,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
