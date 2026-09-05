export interface SlideResource {
  id: string;
  title: string;
  description: string;
  week: number;
  fileFormat: string;
  fileSize: string;
  dateAdded: string;
  downloadUrl: string;
  tags: string[];
  fileBlobUrl?: string;
  fileName?: string;
  fileTextContent?: string;
}

export interface TutorialResource {
  id: string;
  title: string;
  description: string;
  week: number;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  dateAdded: string;
  defaultCompleted: boolean;
  learningObjectives: string[];
  fileBlobUrl?: string;
  fileName?: string;
  fileTextContent?: string;
}

export interface LabResource {
  id: string;
  title: string;
  description: string;
  week: number;
  environment: string; // e.g. "Packet Tracer", "GNS3", "Linux Ubuntu 22.04", "Docker / K8s"
  dateAdded: string;
  downloadFileName: string;
  topologySummary: string;
  configCode?: string;
  commands?: string[];
  fileBlobUrl?: string;
  fileName?: string;
  fileTextContent?: string;
}

export interface ModuleData {
  id: string;
  code: string;
  title: string;
  category: 'Networking' | 'Systems' | 'Programming' | 'Cloud' | 'Security';
  instructor: string;
  credits: number;
  semester: string;
  description: string;
  color: string; // Tailwind color key
  iconName: 'Network' | 'Server' | 'Code2' | 'Cloud' | 'Shield';
  slides: SlideResource[];
  tutorials: TutorialResource[];
  labs: LabResource[];
}

export const MODULES_DATA: ModuleData[] = [
  {
    id: 'csne301',
    code: 'CSNE 301',
    title: 'Network Protocols & Architectures',
    category: 'Networking',
    instructor: 'Dr. Aruni Bandara',
    credits: 4,
    semester: 'Y3S1',
    description: 'Deep dive into enterprise routing protocols (OSPFv3, BGP), IPv6 migration techniques, MPLS traffic engineering, and transport layer optimization.',
    color: 'emerald',
    iconName: 'Network',
    slides: [
      {
        id: 's301-1',
        title: 'Week 01: Multi-Area OSPFv2 & OSPFv3 Implementation',
        description: 'LSAs types 1-7, Area types (Stub, NSSA), DR/BDR election dynamics, and IPv6 address configuration.',
        week: 1,
        fileFormat: 'PDF',
        fileSize: '4.2 MB',
        dateAdded: '2026-08-10',
        downloadUrl: '#',
        tags: ['OSPF', 'IPv6', 'Routing Protocols']
      },
      {
        id: 's301-2',
        title: 'Week 02: Exterior Gateway Routing with BGP',
        description: 'eBGP vs iBGP peering, Autonomous Systems, Path attributes (LOCAL_PREF, MED, AS_PATH), and route reflection.',
        week: 2,
        fileFormat: 'PDF',
        fileSize: '5.8 MB',
        dateAdded: '2026-08-17',
        downloadUrl: '#',
        tags: ['BGP', 'Autonomous Systems', 'Path Selection']
      },
      {
        id: 's301-3',
        title: 'Week 03: MPLS Concepts & L3 VPN Architecture',
        description: 'Label distribution protocol (LDP), Forwarding Equivalence Class (FEC), VRF instances, and MP-BGP integration.',
        week: 3,
        fileFormat: 'PPTX',
        fileSize: '8.1 MB',
        dateAdded: '2026-08-24',
        downloadUrl: '#',
        tags: ['MPLS', 'VPN', 'LDP']
      },
      {
        id: 's301-4',
        title: 'Week 04: Advanced TCP/IP Congestion Control Algorithms',
        description: 'Window management, TCP Cubic vs BBR, ECN signaling, and slow-start performance benchmarking.',
        week: 4,
        fileFormat: 'PDF',
        fileSize: '3.6 MB',
        dateAdded: '2026-08-31',
        downloadUrl: '#',
        tags: ['TCP', 'BBR', 'Congestion Control']
      }
    ],
    tutorials: [
      {
        id: 't301-1',
        title: 'Tutorial 01: OSPF Route Summarization & Stubby Areas',
        description: 'Calculate optimal CIDR route summaries for Area 1 & Area 2; configure Totally Stubby area policies.',
        week: 1,
        estimatedTime: '45 mins',
        difficulty: 'Intermediate',
        dateAdded: '2026-08-12',
        defaultCompleted: true,
        learningObjectives: ['Summarize IPv4 subnets across ABRs', 'Differentiate Stub vs NSSA LSA filtering']
      },
      {
        id: 't301-2',
        title: 'Tutorial 02: BGP Path Manipulation & Attribute Weights',
        description: 'Analyze BGP route decision matrix when Local Preference, AS-Path prepending, and MED collide.',
        week: 2,
        estimatedTime: '60 mins',
        difficulty: 'Advanced',
        dateAdded: '2026-08-19',
        defaultCompleted: false,
        learningObjectives: ['Tune Local_Pref for outbound traffic engineering', 'Use AS-Path prepending for backup WAN traffic']
      },
      {
        id: 't301-3',
        title: 'Tutorial 03: IPv6 Dual-Stack Subnetting & Tunneling',
        description: 'Design a 6to4 & GRE tunneling scheme to connect isolated IPv6 enterprise branches over an IPv4 ISP core.',
        week: 3,
        estimatedTime: '50 mins',
        difficulty: 'Intermediate',
        dateAdded: '2026-08-26',
        defaultCompleted: false,
        learningObjectives: ['Configure IPv6 link-local and global unicast addresses', 'Construct 6in4 GRE encapsulation paths']
      }
    ],
    labs: [
      {
        id: 'l301-1',
        title: 'Lab 01: Enterprise BGP Peering & Multi-Homing Setup',
        description: 'Configure multi-homed Autonomous System AS65001 with ISP-A (AS100) and ISP-B (AS200) with route filtering.',
        week: 2,
        environment: 'GNS3 / Cisco IOSv',
        dateAdded: '2026-08-21',
        downloadFileName: 'lab01_bgp_enterprise.gns3project',
        topologySummary: '3 Routers (Border-1, Border-2, Core-1) connected via Gigabit Ethernet links.',
        configCode: `! Router Border-1 BGP Configuration
router bgp 65001
 router-id 1.1.1.1
 neighbor 203.0.113.1 remote-as 100
 neighbor 203.0.113.1 description ISP-A_PRIMARY
 neighbor 10.0.0.2 remote-as 65001
 neighbor 10.0.0.2 update-source Loopback0
 !
 address-family ipv4
  network 192.168.10.0 mask 255.255.255.0
  neighbor 203.0.113.1 activate
  neighbor 203.0.113.1 route-map SET-LOCAL-PREF-HIGH in
  neighbor 10.0.0.2 activate
 exit-address-family
!
route-map SET-LOCAL-PREF-HIGH permit 10
 set local-preference 200`,
        commands: [
          'show ip bgp summary',
          'show ip bgp neighbors 203.0.113.1 advertised-routes',
          'traceroute 8.8.8.8 source Loopback0'
        ]
      },
      {
        id: 'l301-2',
        title: 'Lab 02: Multi-Area OSPFv3 IPv6 Routing Topology',
        description: 'Deploy OSPFv3 with Process ID 10 across Area 0 (Backbone) and Area 10 (Branch Office).',
        week: 3,
        environment: 'Cisco Packet Tracer 8.2',
        dateAdded: '2026-08-28',
        downloadFileName: 'lab02_ospfv3_ipv6.pkt',
        topologySummary: 'HQ Router, Branch Router, and Central Switch with dual IPv6 subnets.',
        configCode: `! IPv6 OSPFv3 Configuration
ipv6 unicast-routing
!
interface GigabitEthernet0/0/0
 ipv6 address 2001:DB8:ACAD:1::1/64
 ipv6 ospf 10 area 0
!
interface GigabitEthernet0/0/1
 ipv6 address 2001:DB8:ACAD:10::1/64
 ipv6 ospf 10 area 10
!
router ospfv3 10
 router-id 2.2.2.2
 area 10 stub no-summary`,
        commands: [
          'show ipv6 ospf neighbor',
          'show ipv6 route ospf',
          'show ipv6 ospf database'
        ]
      }
    ]
  },
  {
    id: 'csne302',
    code: 'CSNE 302',
    title: 'Server Administration & Linux Security',
    category: 'Systems',
    instructor: 'Eng. Kasun Fernando',
    credits: 4,
    semester: 'Y3S1',
    description: 'Systemd management, SSH key hardening, PAM authentication, SELinux policies, Nginx reverse proxy configuration, and automated backups with Restic.',
    color: 'cyan',
    iconName: 'Server',
    slides: [
      {
        id: 's302-1',
        title: 'Week 01: Systemd Service Units & Storage Management',
        description: 'Creating custom systemd service files, target units, LVM volume expansion, and XFS quota management.',
        week: 1,
        fileFormat: 'PDF',
        fileSize: '3.9 MB',
        dateAdded: '2026-08-11',
        downloadUrl: '#',
        tags: ['Systemd', 'LVM', 'Linux Storage']
      },
      {
        id: 's302-2',
        title: 'Week 02: Pluggable Authentication Modules (PAM) & SSH Hardening',
        description: 'Configuring /etc/pam.d/sshd, MFA with Google Authenticator, fail2ban rule creation, and SSH certificate authorities.',
        week: 2,
        fileFormat: 'PDF',
        fileSize: '4.7 MB',
        dateAdded: '2026-08-18',
        downloadUrl: '#',
        tags: ['PAM', 'SSH Security', 'Fail2ban']
      },
      {
        id: 's302-3',
        title: 'Week 03: High Performance Web Hosting with Nginx & TLS 1.3',
        description: 'Nginx server blocks, HTTP/2 & HTTP/3, Let’s Encrypt automated certbot renewals, and upstream load balancing.',
        week: 3,
        fileFormat: 'PDF',
        fileSize: '5.1 MB',
        dateAdded: '2026-08-25',
        downloadUrl: '#',
        tags: ['Nginx', 'TLS 1.3', 'Reverse Proxy']
      }
    ],
    tutorials: [
      {
        id: 't302-1',
        title: 'Tutorial 01: Custom Systemd Timer & Daemon Scripts',
        description: 'Write a Bash daemon that monitors disk usage and trigger a systemd service unit every 15 minutes.',
        week: 1,
        estimatedTime: '40 mins',
        difficulty: 'Beginner',
        dateAdded: '2026-08-13',
        defaultCompleted: true,
        learningObjectives: ['Build systemd .service and .timer specification files', 'Understand target dependency dependencies']
      },
      {
        id: 't302-2',
        title: 'Tutorial 02: SELinux Context Troubleshooting & Audit Logs',
        description: 'Resolve Apache HTTP standard access denials caused by invalid SELinux file contexts on non-standard ports.',
        week: 2,
        estimatedTime: '55 mins',
        difficulty: 'Intermediate',
        dateAdded: '2026-08-20',
        defaultCompleted: false,
        learningObjectives: ['Parse /var/log/audit/audit.log using ausearch', 'Apply semanage port and chcon persistent rules']
      }
    ],
    labs: [
      {
        id: 'l302-1',
        title: 'Lab 01: Secure Nginx Reverse Proxy with TLS & Rate Limiting',
        description: 'Deploy Nginx on Ubuntu 22.04 with rate-limiting zone, custom error pages, and SSL cipher suite optimization.',
        week: 3,
        environment: 'Ubuntu Server 22.04 LTS (VM)',
        dateAdded: '2026-08-27',
        downloadFileName: 'nginx_proxy_lab.tar.gz',
        topologySummary: 'Single Nginx Edge Node proxying requests to 2 backend Node.js microservices.',
        configCode: `# /etc/nginx/sites-available/csne-hub.conf
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=5r/s;

upstream app_servers {
    server 127.0.0.1:8001 max_fails=3 fail_timeout=10s;
    server 127.0.0.1:8002 max_fails=3 fail_timeout=10s;
}

server {
    listen 443 ssl http2;
    server_name studyhub.csne.ac.lk;

    ssl_certificate /etc/ssl/certs/csne-studyhub.crt;
    ssl_certificate_key /etc/ssl/private/csne-studyhub.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    location /api/ {
        limit_req zone=api_limit burst=10 nodelay;
        proxy_pass http://app_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}`,
        commands: [
          'sudo nginx -t',
          'sudo systemctl reload nginx',
          'curl -Iv https://studyhub.csne.ac.lk/api/health'
        ]
      }
    ]
  },
  {
    id: 'csne303',
    code: 'CSNE 303',
    title: 'Advanced Programming for Networking',
    category: 'Programming',
    instructor: 'Prof. Nalin Wickramasinghe',
    credits: 3,
    semester: 'Y3S1',
    description: 'Asynchronous I/O programming in Python (asyncio), C socket API multi-threading, custom binary protocol serialization, and network packet crafting with Scapy.',
    color: 'violet',
    iconName: 'Code2',
    slides: [
      {
        id: 's303-1',
        title: 'Week 01: Low-level C Socket API & Multi-Client Select/Poll',
        description: 'BSD socket functions (socket, bind, listen, accept), non-blocking sockets, select(), and epoll multiplexing.',
        week: 1,
        fileFormat: 'PDF',
        fileSize: '3.4 MB',
        dateAdded: '2026-08-09',
        downloadUrl: '#',
        tags: ['C Sockets', 'Epoll', 'Async I/O']
      },
      {
        id: 's303-2',
        title: 'Week 02: Python Asyncio & Concurrent Socket Event Loops',
        description: 'Tasks, Futures, Streams API, building custom asynchronous TCP protocol servers handling 10,000+ connections.',
        week: 2,
        fileFormat: 'PDF',
        fileSize: '4.1 MB',
        dateAdded: '2026-08-16',
        downloadUrl: '#',
        tags: ['Python', 'Asyncio', 'Concurrency']
      },
      {
        id: 's303-3',
        title: 'Week 03: Raw Packet Manipulation & Scapy Injection',
        description: 'Crafting custom Ethernet, IP, TCP, and DNS headers, building port scanners, and ARP spoofing detection scripts.',
        week: 3,
        fileFormat: 'PDF',
        fileSize: '6.2 MB',
        dateAdded: '2026-08-23',
        downloadUrl: '#',
        tags: ['Scapy', 'Packet Crafting', 'Network Security']
      }
    ],
    tutorials: [
      {
        id: 't303-1',
        title: 'Tutorial 01: Binary Protocol Header Parsing in C',
        description: 'Unpack custom 16-byte fixed binary headers containing Magic Byte, Flags, Payload Length, and CRC32 checksum.',
        week: 1,
        estimatedTime: '50 mins',
        difficulty: 'Intermediate',
        dateAdded: '2026-08-14',
        defaultCompleted: true,
        learningObjectives: ['Handle network byte order (ntohs/htons)', 'Detect bitwise protocol flag fields']
      },
      {
        id: 't303-2',
        title: 'Tutorial 02: Async Python HTTP/1.1 Minimal Server',
        description: 'Implement a non-blocking raw TCP HTTP server in Python using `asyncio.start_server` parsing GET/POST routes.',
        week: 2,
        estimatedTime: '60 mins',
        difficulty: 'Advanced',
        dateAdded: '2026-08-21',
        defaultCompleted: false,
        learningObjectives: ['Parse HTTP request headers asynchronously', 'Construct RFC compliant HTTP status responses']
      }
    ],
    labs: [
      {
        id: 'l303-1',
        title: 'Lab 01: Automated SYN Flood Detector & Scapy Crafting Tool',
        description: 'Build a Python tool using Scapy that sniffs incoming TCP SYN packets and flags anomalous IP sources.',
        week: 3,
        environment: 'Python 3.11 + Scapy / Wireshark',
        dateAdded: '2026-08-29',
        downloadFileName: 'scapy_syn_detector.py',
        topologySummary: 'Python script executed on Gateway Node capturing traffic on interface eth0.',
        configCode: `# syn_monitor.py - Python Async Packet Inspector
import time
from collections import defaultdict
from scapy.all import sniff, TCP, IP

syn_counts = defaultdict(int)
THRESHOLD = 50  # SYN packets per 5 seconds

def packet_callback(pkt):
    if pkt.haslayer(TCP) and pkt.haslayer(IP):
        if pkt[TCP].flags == 'S':  # SYN flag set
            src_ip = pkt[IP].src
            syn_counts[src_ip] += 1
            if syn_counts[src_ip] > THRESHOLD:
                print(f"[ALERT] Potential SYN Flood detected from: {src_ip} ({syn_counts[src_ip]} SYNs)")

print("[*] Starting Packet Sniffer on eth0...")
sniff(iface="eth0", filter="tcp", prn=packet_callback, store=0)`,
        commands: [
          'sudo python3 syn_monitor.py',
          'hping3 -S -p 80 --flood --rand-source 127.0.0.1  # Test flood in sandbox'
        ]
      }
    ]
  },
  {
    id: 'csne304',
    code: 'CSNE 304',
    title: 'Cloud Infrastructure & Virtualization',
    category: 'Cloud',
    instructor: 'Dr. Thilini Perera',
    credits: 3,
    semester: 'Y3S1',
    description: 'Docker containerization, Kubernetes pod orchestration, Helm package manager, Infrastructure as Code with Terraform, and AWS VPC networking.',
    color: 'amber',
    iconName: 'Cloud',
    slides: [
      {
        id: 's304-1',
        title: 'Week 01: Docker Architecture, Storage Drivers & Security',
        description: 'Container namespaces, cgroups, multi-stage Dockerfiles, Docker Compose production practices, and image scanning.',
        week: 1,
        fileFormat: 'PDF',
        fileSize: '4.8 MB',
        dateAdded: '2026-08-08',
        downloadUrl: '#',
        tags: ['Docker', 'Containers', 'DevOps']
      },
      {
        id: 's304-2',
        title: 'Week 02: Kubernetes Core Primitives & Ingress Controllers',
        description: 'Pods, Deployments, StatefulSets, Services (ClusterIP/NodePort/LoadBalancer), and Nginx Ingress Controller setup.',
        week: 2,
        fileFormat: 'PDF',
        fileSize: '7.3 MB',
        dateAdded: '2026-08-15',
        downloadUrl: '#',
        tags: ['Kubernetes', 'K8s Ingress', 'Orchestration']
      },
      {
        id: 's304-3',
        title: 'Week 03: Infrastructure as Code (IaC) with Terraform & AWS VPC',
        description: 'Terraform providers, state management, modules, provisioning AWS VPC with public/private subnets & NAT Gateways.',
        week: 3,
        fileFormat: 'PPTX',
        fileSize: '9.2 MB',
        dateAdded: '2026-08-22',
        downloadUrl: '#',
        tags: ['Terraform', 'AWS VPC', 'IaC']
      }
    ],
    tutorials: [
      {
        id: 't304-1',
        title: 'Tutorial 01: Optimized Multi-Stage Dockerfile Construction',
        description: 'Refactor a 850MB Python application image down to 85MB using Alpine Linux and multi-stage build cache tricks.',
        week: 1,
        estimatedTime: '35 mins',
        difficulty: 'Beginner',
        dateAdded: '2026-08-11',
        defaultCompleted: true,
        learningObjectives: ['Utilize .dockerignore effectively', 'Leverage build cache layering']
      },
      {
        id: 't304-2',
        title: 'Tutorial 02: Kubernetes Rolling Updates & Canary Deployments',
        description: 'Configure maxSurge and maxUnavailable strategy parameters inside a K8s Deployment manifest for zero-downtime updates.',
        week: 2,
        estimatedTime: '45 mins',
        difficulty: 'Intermediate',
        dateAdded: '2026-08-18',
        defaultCompleted: false,
        learningObjectives: ['Execute kubectl rollout status and undo', 'Configure readiness and liveness HTTP probes']
      }
    ],
    labs: [
      {
        id: 'l304-1',
        title: 'Lab 01: Terraform Provisioning of High Availability AWS VPC',
        description: 'Deploy 2 Public Subnets, 2 Private Subnets, Internet Gateway, and Route Tables using Terraform CLI.',
        week: 3,
        environment: 'Terraform v1.5 + AWS CLI',
        dateAdded: '2026-08-28',
        downloadFileName: 'terraform_aws_vpc_lab.tf',
        topologySummary: 'AWS us-east-1 VPC (10.0.0.0/16) spanning 2 Availability Zones.',
        configCode: `# main.tf - AWS VPC Module
resource "aws_vpc" "csne_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = {
    Name = "CSNE-StudyHub-VPC"
    Env  = "Production"
  }
}

resource "aws_subnet" "public_1a" {
  vpc_id                  = aws_vpc.csne_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.csne_vpc.id
}`,
        commands: [
          'terraform init',
          'terraform plan -out=tfplan',
          'terraform apply tfplan'
        ]
      }
    ]
  },
  {
    id: 'csne305',
    code: 'CSNE 305',
    title: 'Cyber Security & Network Defense',
    category: 'Security',
    instructor: 'Dr. Chathura Rajapakse',
    credits: 4,
    semester: 'Y3S1',
    description: 'Packet analysis with Wireshark & Tshark, Snort IDS rule creation, iptables/nftables firewall policies, and ethical penetration testing methodologies.',
    color: 'rose',
    iconName: 'Shield',
    slides: [
      {
        id: 's305-1',
        title: 'Week 01: Deep Packet Inspection & Tshark Filters',
        description: 'Wireshark display/capture filters, TCP stream reconstruction, dissecting encrypted TLS Client Hello SNI headers.',
        week: 1,
        fileFormat: 'PDF',
        fileSize: '6.5 MB',
        dateAdded: '2026-08-07',
        downloadUrl: '#',
        tags: ['Wireshark', 'Tshark', 'Packet Inspection']
      },
      {
        id: 's305-2',
        title: 'Week 02: Snort 3 Intrusion Detection System (IDS) Engine',
        description: 'Snort rule syntax (header, options, content, pcre), alert classification, detection thresholds, and inline IPS drop rules.',
        week: 2,
        fileFormat: 'PDF',
        fileSize: '5.4 MB',
        dateAdded: '2026-08-14',
        downloadUrl: '#',
        tags: ['Snort IDS', 'IPS Rules', 'Network Defense']
      },
      {
        id: 's305-3',
        title: 'Week 03: Linux Stateful Firewalls with Nftables',
        description: 'Tables, chains, sets, state tracking (ct state established, related), rate limiting brute-force SSH attacks.',
        week: 3,
        fileFormat: 'PDF',
        fileSize: '4.9 MB',
        dateAdded: '2026-08-21',
        downloadUrl: '#',
        tags: ['Nftables', 'Firewall', 'Security Policies']
      }
    ],
    tutorials: [
      {
        id: 't305-1',
        title: 'Tutorial 01: Writing Custom Snort Rules for SQLi & XSS Detection',
        description: 'Design Snort detection signature for HTTP GET parameters containing standard SQL injection signatures (`UNION SELECT`).',
        week: 1,
        estimatedTime: '45 mins',
        difficulty: 'Intermediate',
        dateAdded: '2026-08-10',
        defaultCompleted: false,
        learningObjectives: ['Utilize Snort payload inspection keywords', 'Understand fast pattern match optimizations']
      },
      {
        id: 't305-2',
        title: 'Tutorial 02: Analysis of PCAP Malware Traffic Capture',
        description: 'Extract suspicious executable payloads embedded in HTTP traffic streams from an infected endpoint PCAP.',
        week: 2,
        estimatedTime: '60 mins',
        difficulty: 'Advanced',
        dateAdded: '2026-08-17',
        defaultCompleted: false,
        learningObjectives: ['Extract HTTP objects via Wireshark CLI', 'Analyze hash signatures on VirusTotal']
      }
    ],
    labs: [
      {
        id: 'l305-1',
        title: 'Lab 01: Stateful Nftables Perimeter Firewall Policy Configuration',
        description: 'Build a strict default-drop firewall policy allowing inbound HTTPS/SSH with ICMP rate limiting.',
        week: 3,
        environment: 'Kali Linux / Debian 12',
        dateAdded: '2026-08-25',
        downloadFileName: 'nftables_hardened.conf',
        topologySummary: 'Single dual-homed Linux Gateway filtering traffic between WAN and LAN.',
        configCode: `#!/usr/sbin/nft -f
# /etc/nftables.conf

flush ruleset

table inet filter {
    chain input {
        type filter hook input priority 0; policy drop;

        # Accept established & related connections
        ct state { established, related } accept

        # Accept loopback traffic
        iifname "lo" accept

        # ICMP echo-request (ping) rate limited
        ip protocol icmp icmp type echo-request limit rate 5/second accept

        # Allow SSH (Port 22) with rate limiting
        tcp dport 22 ct state new limit rate 3/minute accept

        # Allow HTTPS (Port 443)
        tcp dport 443 accept
    }
}`,
        commands: [
          'sudo nft -f /etc/nftables.conf',
          'sudo nft list ruleset',
          'nmap -sS -p 1-1000 <TARGET_IP>  # Port scan verification'
        ]
      }
    ]
  }
];
